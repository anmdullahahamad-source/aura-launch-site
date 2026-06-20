import { useEffect, useRef } from "react";
import { useIsLowEndDevice } from "../hooks/useIsLowEndDevice";

interface TrailParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  decay: number;
  hue: number;
}

interface BubbleParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  vy: number;
  vx: number;
  phase: number;
  freq: number;
}

interface Point {
  x: number;
  y: number;
}

export function RocketTrail() {
  const isLowEnd = useIsLowEndDevice();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const cursorRef = useRef<Point | null>(null);
  const rocketRef = useRef<Point>({ x: -9999, y: -9999 });
  const trailRef = useRef<TrailParticle[]>([]);
  const bubblesRef = useRef<BubbleParticle[]>([]);
  const rafRef = useRef(0);
  const lastBubbleRef = useRef(0);
  const frameRef = useRef(0);
  const historyRef = useRef<Point[]>([]);
  const dimsRef = useRef({ w: 0, h: 0 });
  const isMobileRef = useRef(false);
  const lastEventRef = useRef(0);
  const idleRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || isLowEnd) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    const isMobile = window.innerWidth < 768;
    isMobileRef.current = isMobile;

    const MAX_TRAIL = isMobile ? 15 : 30;
    const MAX_BUBBLES = isMobile ? 0 : 6;
    const THROTTLE = isMobile ? 80 : 33;
    const LERP = isMobile ? 0.15 : 0.1;
    const SPAWN_RATE = 1;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dimsRef.current = { w: window.innerWidth, h: window.innerHeight };
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function handleMove(x: number, y: number) {
      const now = performance.now();
      if (now - lastEventRef.current < THROTTLE) return;
      lastEventRef.current = now;

      if (idleRef.current) {
        idleRef.current = false;
        if (!rafRef.current) rafRef.current = requestAnimationFrame(loop);
      }

      if (!cursorRef.current) {
        rocketRef.current = { x, y };
      }

      const h = historyRef.current;
      h.push({ x, y });
      if (h.length > 5) h.shift();

      cursorRef.current = { x, y };

      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => { idleRef.current = true; }, 3000);
    }

    function onMouseMove(e: MouseEvent) {
      handleMove(e.clientX, e.clientY);
    }

    function onTouchMove(e: TouchEvent) {
      const t = e.touches[0];
      if (t) handleMove(t.clientX, t.clientY);
    }

    function onTouchStart(e: TouchEvent) {
      const t = e.touches[0];
      if (t) {
        cursorRef.current = { x: t.clientX, y: t.clientY };
        rocketRef.current = { x: t.clientX, y: t.clientY };
        historyRef.current.push({ x: t.clientX, y: t.clientY });
      }
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    function getVelocity(): Point {
      const h = historyRef.current;
      if (h.length < 2) return { x: 0, y: 0 };
      return {
        x: h[h.length - 1].x - h[0].x,
        y: h[h.length - 1].y - h[0].y,
      };
    }

    function loop(time: number) {
      rafRef.current = requestAnimationFrame(loop);
      frameRef.current++;

      if (idleRef.current) return;

      const cursor = cursorRef.current;
      const rocket = rocketRef.current;
      const { w, h } = dimsRef.current;

      if (cursor) {
        rocket.x += (cursor.x - rocket.x) * LERP;
        rocket.y += (cursor.y - rocket.y) * LERP;
      }

      const vel = getVelocity();
      const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
      const moving = cursor !== null && speed > 1;

      if (moving) {
        for (let i = 0; i < SPAWN_RATE; i++) {
          trailRef.current.push({
            x: rocket.x + (Math.random() - 0.5) * 6,
            y: rocket.y + (Math.random() - 0.5) * 6,
            size: 2 + Math.random() * 4,
            alpha: 0.5 + Math.random() * 0.3,
            decay: 0.012 + Math.random() * 0.008,
            hue: 210 + Math.random() * 50,
          });
        }

        if (!isMobile && time - lastBubbleRef.current > 600 + Math.random() * 600) {
          lastBubbleRef.current = time;
          bubblesRef.current.push({
            x: rocket.x + (Math.random() - 0.5) * 24,
            y: rocket.y + (Math.random() - 0.5) * 12,
            size: 2 + Math.random() * 3,
            alpha: 0.4 + Math.random() * 0.3,
            vy: -(0.3 + Math.random() * 0.6),
            vx: (Math.random() - 0.5) * 0.3,
            phase: Math.random() * Math.PI * 2,
            freq: 0.02 + Math.random() * 0.02,
          });
        }
      }

      const trail = trailRef.current;
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.alpha -= p.decay;
        p.size *= 0.995;
        if (p.alpha <= 0 || p.size < 0.3) {
          trail.splice(i, 1);
        }
      }

      const bubbles = bubblesRef.current;
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.y += b.vy;
        b.x += b.vx + Math.sin(frameRef.current * b.freq + b.phase) * 0.15;
        b.alpha -= 0.006;
        if (b.alpha <= 0) {
          bubbles.splice(i, 1);
        }
      }

      while (trail.length > MAX_TRAIL) trail.shift();
      while (bubbles.length > MAX_BUBBLES) bubbles.shift();

      const c = ctx!;
      c.clearRect(0, 0, w, h);
      if (!cursor) return;

      const spdFactor = Math.min(speed / 100, 1);

      for (const p of trail) {
        const a = p.alpha * 0.55;
        if (a < 0.01) continue;
        c.beginPath();
        c.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        c.fillStyle = `hsla(${p.hue}, 60%, 65%, ${a})`;
        c.fill();
      }

      for (const b of bubbles) {
        c.beginPath();
        c.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        c.fillStyle = `hsla(230, 30%, 90%, ${b.alpha * 0.45})`;
        c.fill();
      }

      const rSize = isMobile ? 3 : 5;

      if (!isMobile) {
        c.beginPath();
        c.arc(rocket.x, rocket.y, rSize * 3.5, 0, Math.PI * 2);
        c.fillStyle = `hsla(220, 80%, 65%, ${0.12 + spdFactor * 0.08})`;
        c.shadowBlur = 35;
        c.shadowColor = `hsla(215, 90%, 60%, ${0.25 + spdFactor * 0.2})`;
        c.fill();
      }

      if (speed > 3 && !isMobile) {
        const angle = Math.atan2(vel.y, vel.x);
        const flameLen = Math.min(6 + speed * 0.04 + Math.random() * 2, 22);
        const baseX = rocket.x - Math.cos(angle) * rSize * 1.2;
        const baseY = rocket.y - Math.sin(angle) * rSize * 1.2;
        const tipX = rocket.x - Math.cos(angle) * (rSize * 1.2 + flameLen);
        const tipY = rocket.y - Math.sin(angle) * (rSize * 1.2 + flameLen);
        const perpX = -Math.sin(angle) * rSize * 1.2;
        const perpY = Math.cos(angle) * rSize * 1.2;

        c.beginPath();
        c.moveTo(baseX + perpX, baseY + perpY);
        c.lineTo(tipX, tipY);
        c.lineTo(baseX - perpX, baseY - perpY);
        c.closePath();
        c.fillStyle = `hsla(30, 90%, 60%, ${0.5 + spdFactor * 0.3})`;
        c.shadowBlur = 12;
        c.shadowColor = `hsla(25, 100%, 55%, ${0.4 + spdFactor * 0.3})`;
        c.fill();

        const innerTipX = rocket.x - Math.cos(angle) * (rSize * 1.2 + flameLen * 0.5);
        const innerTipY = rocket.y - Math.sin(angle) * (rSize * 1.2 + flameLen * 0.5);
        c.beginPath();
        c.moveTo(baseX + perpX * 0.5, baseY + perpY * 0.5);
        c.lineTo(innerTipX, innerTipY);
        c.lineTo(baseX - perpX * 0.5, baseY - perpY * 0.5);
        c.closePath();
        c.fillStyle = `hsla(40, 100%, 85%, ${0.6 + spdFactor * 0.3})`;
        c.fill();
      }

      c.beginPath();
      c.arc(rocket.x, rocket.y, rSize, 0, Math.PI * 2);
      c.fillStyle = "hsla(220, 40%, 96%, 0.95)";
      c.shadowBlur = 20;
      c.shadowColor = `hsla(210, 100%, 75%, ${0.5 + spdFactor * 0.2})`;
      c.fill();

      c.shadowBlur = 0;
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(idleTimerRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, [isLowEnd]);

  if (isLowEnd) return null;

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 pointer-events-none z-[9998]" />;
}
