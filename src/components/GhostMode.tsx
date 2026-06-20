import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useIsLowEndDevice } from "../hooks/useIsLowEndDevice";

interface Whisper {
  id: number;
  text: string;
  x: number;
  y: number;
}

interface ClickMeText {
  id: number;
  x: number;
  y: number;
}

interface StreakParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
}

interface Afterimage {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

interface Shockwave {
  id: number;
  x: number;
  y: number;
}

interface GhostEntity {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  baseScale: number;
  opacity: number;
  expression: "smile" | "neutral" | "intense";
  isClone: boolean;
}

type EntityEvent = "split" | "teleport" | "merge" | "idle";

const TOTAL_DURATION = 6500;
const MAX_WHISPERS = 3;
const WHISPER_TEXTS = ["Hello...", "Still here...", "You can't catch me...", "...", "\u{1F440}"];
const CURSOR_WHISPER_TEXTS = ["Hello...", "Still here...", "You can't catch me...", "..."];
const MAX_AFTERIMAGES = 4;
const MAX_CLONES = 3;
const THROTTLE_MS = 33;
const AFTERIMAGE_INTERVAL = 120;
const STREAK_INTERVAL = 120;
const STREAK_COUNT = 2;

let whisperIdCounter = 0;
let clickIdCounter = 0;
let trailIdCounter = 0;
let afterimageIdCounter = 0;
let streakIdCounter = 0;
let shockwaveIdCounter = 0;
let entityIdCounter = 0;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function useAggressiveAudio(active: boolean) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!active || prefersReduced) return;

    try {
      const ctx = new AudioContext();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.06, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const humGain = ctx.createGain();
      humGain.gain.setValueAtTime(0, ctx.currentTime);
      humGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.8);
      humGain.connect(masterGain);

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(50, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 2);
      osc.connect(humGain);
      osc.start();

      const tensionGain = ctx.createGain();
      tensionGain.gain.setValueAtTime(0, ctx.currentTime);
      tensionGain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 1.5);
      tensionGain.connect(masterGain);

      const tensionOsc = ctx.createOscillator();
      tensionOsc.type = "sawtooth";
      tensionOsc.frequency.setValueAtTime(150, ctx.currentTime);
      tensionOsc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 3);
      tensionOsc.connect(tensionGain);
      tensionOsc.start();

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(Math.random(), 2);
      }
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = buffer;
      noiseSrc.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.setValueAtTime(400, ctx.currentTime);
      noiseFilter.frequency.linearRampToValueAtTime(600, ctx.currentTime + 2);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1);
      noiseGain.connect(masterGain);

      noiseSrc.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseSrc.start();

      return () => {
        const t = ctx.currentTime;
        humGain.gain.linearRampToValueAtTime(0, t + 0.5);
        tensionGain.gain.linearRampToValueAtTime(0, t + 0.5);
        noiseGain.gain.linearRampToValueAtTime(0, t + 0.5);
        setTimeout(() => {
          osc.stop();
          tensionOsc.stop();
          noiseSrc.stop();
          ctx.close();
        }, 700);
      };
    } catch {}
  }, [active, prefersReduced]);
}

export function GhostMode({ active, onComplete }: { active: boolean; onComplete: () => void }) {
  const isLowEnd = useIsLowEndDevice();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<
    "idle" | "darken" | "emerge" | "face" | "speak" | "presence" | "exiting"
  >("idle");
  const [ghostScale, setGhostScale] = useState(0);
  const [faceOpacity, setFaceOpacity] = useState(0);
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [clickTexts, setClickTexts] = useState<ClickMeText[]>([]);
  const [streakParticles, setStreakParticles] = useState<StreakParticle[]>([]);
  const [afterimages, setAfterimages] = useState<Afterimage[]>([]);
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([]);
  const [shakeActive, setShakeActive] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0.5);
  const [headRotY, setHeadRotY] = useState(0);
  const [eyeOffX, setEyeOffX] = useState(0);
  const [motionBlur, setMotionBlur] = useState(0);
  const [entities, setEntities] = useState<GhostEntity[]>([]);
  const [eventFlash, setEventFlash] = useState(0);
  const [spookyMessage, setSpookyMessage] = useState("");

  const ghostRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const rafRef = useRef(0);
  const spawnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReduced = useReducedMotion();
  const [screenSize, setScreenSize] = useState({ w: 800, h: 600 });

  const cursorRef = useRef({ x: -1000, y: -1000 });
  const lastCursorTime = useRef(0);
  const cursorWhisperTimer = useRef(0);
  const cursorHistory = useRef<{ x: number; y: number; t: number }[]>([]);
  const cursorStillTimer = useRef(0);
  const lastCursorPosProcessed = useRef({ x: -1000, y: -1000 });
  const activeRef = useRef(false);
  const isMobileRef = useRef(false);

  const mainEntity = useRef<GhostEntity>({
    id: 0,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    scale: 1,
    baseScale: 1,
    opacity: 1,
    expression: "neutral",
    isClone: false,
  });
  const clonesRef = useRef<GhostEntity[]>([]);
  const frameCounterRef = useRef(0);
  const eventTimer = useRef(0);
  const lastSplitTime = useRef(0);
  const lastTeleportTime = useRef(0);
  const lastAfterimageTime = useRef(0);
  const lastStreakTime = useRef(0);
  const lastEventFlash = useRef(0);

  useAggressiveAudio(active && phase !== "idle" && phase !== "exiting");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const w = window.innerWidth;
      const h = window.innerHeight;
      isMobileRef.current = w < 768;
      setScreenSize({ w, h });
      const mid = { x: w * 0.5, y: h * 0.45 };
      mainEntity.current = {
        id: ++entityIdCounter,
        ...mid,
        vx: 0,
        vy: 0,
        scale: 1,
        baseScale: 1,
        opacity: 1,
        expression: "neutral",
        isClone: false,
      };
      const handler = () => {
        const nw = window.innerWidth;
        isMobileRef.current = nw < 768;
        setScreenSize({ w: nw, h: window.innerHeight });
      };
      window.addEventListener("resize", handler);
      return () => window.removeEventListener("resize", handler);
    }
  }, []);

  useEffect(() => {
    if (!active || prefersReduced) return;

    const handleMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastCursorTime.current < THROTTLE_MS) return;
      lastCursorTime.current = now;
      cursorRef.current = { x: e.clientX, y: e.clientY };

      cursorHistory.current.push({ x: e.clientX, y: e.clientY, t: now });
      if (cursorHistory.current.length > 5) cursorHistory.current.shift();
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [active, prefersReduced]);

  function triggerSplit() {
    const now = performance.now();
    if (now - lastSplitTime.current < 2000) return;
    if (clonesRef.current.length >= MAX_CLONES) return;
    lastSplitTime.current = now;
    const remaining = MAX_CLONES - clonesRef.current.length;
    const count = Math.min(1 + Math.floor(Math.random() * MAX_CLONES), remaining);
    const m = mainEntity.current;
    const newClones: GhostEntity[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
      const speed = 3 + Math.random() * 4;
      newClones.push({
        id: ++entityIdCounter,
        x: m.x,
        y: m.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        scale: 0.5 + Math.random() * 0.2,
        baseScale: 0.5 + Math.random() * 0.2,
        opacity: 0.7 + Math.random() * 0.3,
        expression: "intense",
        isClone: true,
      });
    }
    clonesRef.current = [...clonesRef.current, ...newClones];
    setEntities([m, ...clonesRef.current]);
    setEventFlash(2);
    lastEventFlash.current = now;
  }

  function triggerTeleport() {
    const now = performance.now();
    if (now - lastTeleportTime.current < 1800) return;
    lastTeleportTime.current = now;
    const m = mainEntity.current;
    const w = screenSize.w;
    const h = screenSize.h;
    const margin = w * 0.12;
    const newX = margin + Math.random() * (w - margin * 2);
    const newY = margin + Math.random() * (h - margin * 2);

    setEntities((prev) => prev.map((e) => (e.id === m.id ? { ...e, opacity: 0 } : e)));

    shockwaveIdCounter++;
    setShockwaves((prev) => [...prev, { id: shockwaveIdCounter, x: newX, y: newY }]);
    setTimeout(() => setShockwaves((prev) => prev.filter((s) => s.id !== shockwaveIdCounter)), 600);
    setEventFlash(3);
    lastEventFlash.current = now;

    setTimeout(() => {
      m.x = newX;
      m.y = newY;
      m.vx = 0;
      m.vy = 0;
      setEntities((prev) =>
        prev.map((e) => (e.id === m.id ? { ...e, x: newX, y: newY, opacity: 1 } : e)),
      );
    }, 250);
  }

  function getCursorVelocity(): number {
    const hist = cursorHistory.current;
    if (hist.length < 2) return 0;
    const latest = hist[hist.length - 1];
    const prev = hist[0];
    const dt = (latest.t - prev.t) / 1000 || 0.01;
    const dx = latest.x - prev.x;
    const dy = latest.y - prev.y;
    return Math.sqrt(dx * dx + dy * dy) / dt;
  }

  useEffect(() => {
    if (!active || isLowEnd) return;
    activeRef.current = true;

    setVisible(true);
    setPhase("darken");
    setShakeActive(true);
    setEntities([mainEntity.current]);

    const shakeTimer = setTimeout(() => setShakeActive(false), 500);
    const emergeTimer = setTimeout(() => {
      if (!activeRef.current) return;
      setPhase("emerge");
      setGhostScale(prefersReduced ? 0.35 : 0.55);
      const w = screenSize.w;
      const h = screenSize.h;
      const fromLeft = Math.random() > 0.5;
      mainEntity.current.x = fromLeft ? -w * 0.08 : w * 1.08;
      mainEntity.current.y = h * (0.35 + Math.random() * 0.2);
      mainEntity.current.vx = fromLeft ? 20 : -20;
      mainEntity.current.vy = (Math.random() - 0.5) * 4;
      setEntities([{ ...mainEntity.current }]);
    }, 300);
    const faceTimer = setTimeout(() => {
      if (!activeRef.current) return;
      setPhase("face");
      setFaceOpacity(1);
    }, 900);
    const messageTimer = setTimeout(() => {
      if (!activeRef.current) return;
      setSpookyMessage("I can see you!!!");
    }, 1200);
    const messageClearTimer = setTimeout(() => {
      if (!activeRef.current) return;
      setSpookyMessage("");
    }, 4200);
    const speakTimer = setTimeout(() => {
      if (!activeRef.current) return;
      setPhase("speak");
    }, 1600);
    const presenceTimer = setTimeout(() => {
      if (!activeRef.current) return;
      setPhase("presence");
    }, 3000);
    const exitTimer = setTimeout(() => {
      activeRef.current = false;
      setPhase("exiting");
      clonesRef.current = [];
      setGhostScale(0);
      setFaceOpacity(0);
      setMotionBlur(0);
      setTimeout(() => {
        setVisible(false);
        setPhase("idle");
        setWhispers([]);
        setSpookyMessage("");
        setClickTexts([]);
        setStreakParticles([]);
        setAfterimages([]);
        setShockwaves([]);
        setEntities([]);
        setShakeActive(false);
        onComplete();
      }, 1000);
    }, TOTAL_DURATION);

    return () => {
      activeRef.current = false;
      clearTimeout(shakeTimer);
      clearTimeout(emergeTimer);
      clearTimeout(faceTimer);
      clearTimeout(messageTimer);
      clearTimeout(messageClearTimer);
      clearTimeout(speakTimer);
      clearTimeout(presenceTimer);
      clearTimeout(exitTimer);
    };
  }, [active]);

  const scheduleWhisper = useCallback(() => {
    if (phase !== "speak" && phase !== "presence") return;
    if (isMobileRef.current) return;
    const delay = 2000 + Math.random() * 1500;
    spawnTimer.current = setTimeout(() => {
      if (!activeRef.current) return;
      if (isMobileRef.current) return;
      const all = [mainEntity.current, ...clonesRef.current];
      const src = all.length > 0 ? all[Math.floor(Math.random() * all.length)] : mainEntity.current;
      const text = WHISPER_TEXTS[Math.floor(Math.random() * WHISPER_TEXTS.length)];
      const id = ++whisperIdCounter;
      setWhispers((prev) => {
        const next = [
          ...prev,
          {
            id,
            text,
            x: src.x + (Math.random() - 0.5) * 120,
            y: src.y - 40 + (Math.random() - 0.5) * 60,
          },
        ];
        return next.length > MAX_WHISPERS ? next.slice(-MAX_WHISPERS) : next;
      });
      setTimeout(
        () => setWhispers((prev) => prev.filter((w) => w.id !== id)),
        1800 + Math.random() * 400,
      );
      scheduleWhisper();
    }, delay);
  }, [phase]);

  useEffect(() => {
    if ((phase === "speak" || phase === "presence") && !prefersReduced && !isMobileRef.current) {
      scheduleWhisper();
    }
    return () => {
      if (spawnTimer.current) clearTimeout(spawnTimer.current);
    };
  }, [phase, scheduleWhisper, prefersReduced]);

  const scheduleClickText = useCallback(() => {
    if (phase !== "presence") return;
    if (isMobileRef.current) return;
    const delay = 2000 + Math.random() * 1000;
    clickTimer.current = setTimeout(() => {
      if (!activeRef.current) return;
      if (isMobileRef.current) return;
      const ox = (Math.random() - 0.5) * 120 - 50;
      const oy = -70 - Math.random() * 40;
      const id = ++clickIdCounter;
      setClickTexts((prev) => [
        ...prev,
        { id, x: mainEntity.current.x + ox, y: mainEntity.current.y + oy },
      ]);
      setTimeout(
        () => setClickTexts((prev) => prev.filter((c) => c.id !== id)),
        1600 + Math.random() * 500,
      );
      scheduleClickText();
    }, delay);
  }, [phase]);

  useEffect(() => {
    if (phase === "presence" && !prefersReduced && !isMobileRef.current) {
      scheduleClickText();
    }
    return () => {
      if (clickTimer.current) clearTimeout(clickTimer.current);
    };
  }, [phase, scheduleClickText, prefersReduced]);

  // Event flash decay
  useEffect(() => {
    if (eventFlash === 0) return;
    const t = setTimeout(() => setEventFlash((p) => Math.max(0, p - 0.1)), 50);
    return () => clearTimeout(t);
  }, [eventFlash]);

  // Main RAF loop
  useEffect(() => {
    if (phase === "idle" || phase === "darken" || phase === "exiting") return;

    const w = screenSize.w;
    const h = screenSize.h;
    const maxSpeed = prefersReduced ? 2 : 9;
    const steerForce = prefersReduced ? 0.02 : 0.15;
    const isMobile = isMobileRef.current;

    const tick = (now: number) => {
      if (!activeRef.current) return;

      frameCounterRef.current++;
      const skipReactUpdates = frameCounterRef.current % 3 !== 0;

      const cursor = cursorRef.current;
      const m = mainEntity.current;
      const cdx = cursor.x - m.x;
      const cdy = cursor.y - m.y;
      const cursorDist = Math.sqrt(cdx * cdx + cdy * cdy);
      const cursorSpeed = getCursorVelocity();

      // Skip heavy updates when cursor hasn't moved significantly
      const dx = cursor.x - lastCursorPosProcessed.current.x;
      const dy = cursor.y - lastCursorPosProcessed.current.y;
      const cursorMoved = Math.sqrt(dx * dx + dy * dy) > 3;
      if (cursorMoved) {
        lastCursorPosProcessed.current = { x: cursor.x, y: cursor.y };
      }

      // Cursor-based decisions
      if (
        now - lastSplitTime.current > 2500 &&
        cursorSpeed > 600 &&
        clonesRef.current.length === 0
      ) {
        triggerSplit();
      }
      if (now - lastTeleportTime.current > 2500 && cursorDist < 120 && Math.random() < 0.015) {
        triggerTeleport();
      }

      // Merge clones back if far enough
      if (clonesRef.current.length > 0) {
        let allMerged = true;
        clonesRef.current = clonesRef.current.map((c) => {
          const dx = m.x - c.x;
          const dy = m.y - c.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 30) {
            return { ...c, opacity: 0 };
          }
          allMerged = false;
          const mergeForce = 0.03;
          c.vx += dx * mergeForce;
          c.vy += dy * mergeForce;
          const spd = Math.sqrt(c.vx ** 2 + c.vy ** 2);
          if (spd > 5) {
            c.vx = (c.vx / spd) * 5;
            c.vy = (c.vy / spd) * 5;
          }
          c.vx *= 0.96;
          c.vy *= 0.96;
          c.x += c.vx;
          c.y += c.vy;
          c.scale = lerp(c.scale, c.baseScale, 0.05);
          return c;
        });

        if (allMerged) {
          clonesRef.current = [];
        }
      }

      // Main entity physics
      let ax = 0;
      let ay = 0;

      // Decide main behavior
      if (clonesRef.current.length === 0) {
        if (cursorDist < 100 && cursorSpeed < 50) {
          ax = cdx * steerForce * 0.4;
          ay = cdy * steerForce * 0.4;
          m.expression = "smile";
        } else if (cursorDist < 180 && cursorSpeed > 100) {
          ax = -cdx * steerForce * 1.2;
          ay = -cdy * steerForce * 1.2;
          m.expression = "intense";
        } else {
          const wanderAngle = now * 0.002;
          ax = Math.sin(wanderAngle) * steerForce * 0.8;
          ay = Math.cos(wanderAngle * 0.7) * steerForce * 0.8;
          ax += cdx * steerForce * 0.08;
          ay += cdy * steerForce * 0.08;
          m.expression = cursorDist < 300 ? "intense" : "neutral";
        }
      } else {
        ax = Math.sin(now * 0.001) * steerForce * 0.3;
        ay = Math.cos(now * 0.0013) * steerForce * 0.3;
        m.expression = "neutral";
      }

      m.vx += ax;
      m.vy += ay;
      const speed = Math.sqrt(m.vx ** 2 + m.vy ** 2);
      if (speed > maxSpeed) {
        m.vx = (m.vx / speed) * maxSpeed;
        m.vy = (m.vy / speed) * maxSpeed;
      }
      m.vx *= 0.92;
      m.vy *= 0.92;
      m.x += m.vx;
      m.y += m.vy;

      const margin = w * 0.08;
      if (m.x < margin) {
        m.x = margin;
        m.vx = Math.abs(m.vx) * 0.5;
      }
      if (m.x > w - margin) {
        m.x = w - margin;
        m.vx = -Math.abs(m.vx) * 0.5;
      }
      if (m.y < margin) {
        m.y = margin;
        m.vy = Math.abs(m.vy) * 0.5;
      }
      if (m.y > h - margin) {
        m.y = h - margin;
        m.vy = -Math.abs(m.vy) * 0.5;
      }

      const allEntities = [m, ...clonesRef.current].filter((e) => e.opacity > 0.01);

      if (!skipReactUpdates && (cursorMoved || Math.random() < 0.1)) {
        const blurAmount = clamp(speed / maxSpeed, 0, 1) * 5;
        setMotionBlur(blurAmount);

        setEntities(allEntities);

        if (cursorDist < 500) {
          const rotY = clamp(cdx / w, -1, 1) * (14 - clamp(cursorDist / 500, 0, 1) * 8);
          setHeadRotY(rotY);
          setEyeOffX(clamp(cdx / 120, -6, 6));
          setGlowIntensity(clamp(1 - cursorDist / 600, 0.3, 1));
        } else {
          setGlowIntensity(0.3);
          setHeadRotY(0);
          setEyeOffX(0);
        }
      }

      // Afterimages
      if (
        !skipReactUpdates &&
        !prefersReduced &&
        !isMobile &&
        cursorMoved &&
        now - lastAfterimageTime.current > AFTERIMAGE_INTERVAL
      ) {
        lastAfterimageTime.current = now;
        allEntities.forEach((e) => {
          const id = ++afterimageIdCounter;
          setAfterimages((prev) => {
            const next = [...prev, { id, x: e.x, y: e.y, scale: e.scale * 0.7, opacity: 0.15 }];
            return next.length > MAX_AFTERIMAGES ? next.slice(-MAX_AFTERIMAGES) : next;
          });
          setTimeout(() => setAfterimages((prev) => prev.filter((a) => a.id !== id)), 350);
        });
      }

      // Streak particles
      if (
        !skipReactUpdates &&
        !prefersReduced &&
        !isMobile &&
        speed > 1.5 &&
        now - lastStreakTime.current > STREAK_INTERVAL
      ) {
        lastStreakTime.current = now;
        const count = speed > 4 ? STREAK_COUNT + 1 : STREAK_COUNT;
        for (let i = 0; i < count; i++) {
          const id = ++streakIdCounter;
          const angle = Math.atan2(m.vy, m.vx) + (Math.random() - 0.5) * 1.8;
          const spd = 1 + Math.random() * 4;
          setStreakParticles((prev) => [
            ...prev,
            {
              id,
              x: m.x + (Math.random() - 0.5) * 50,
              y: m.y + (Math.random() - 0.5) * 50,
              size: 1.5 + Math.random() * 3.5,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
            },
          ]);
          setTimeout(
            () => setStreakParticles((prev) => prev.filter((s) => s.id !== id)),
            500 + Math.random() * 300,
          );
        }
      }

      // Cursor whispers
      if (!skipReactUpdates && !isMobile && cursorDist < 180 && now - cursorWhisperTimer.current > 2500) {
        cursorWhisperTimer.current = now;
        const text = CURSOR_WHISPER_TEXTS[Math.floor(Math.random() * CURSOR_WHISPER_TEXTS.length)];
        const id = ++whisperIdCounter;
        setWhispers((prev) => {
          const next = [
            ...prev,
            {
              id,
              text,
              x: cursor.x + (Math.random() - 0.5) * 70,
              y: cursor.y - 30 + (Math.random() - 0.5) * 50,
            },
          ];
          return next.length > MAX_WHISPERS ? next.slice(-MAX_WHISPERS) : next;
        });
        setTimeout(() => setWhispers((prev) => prev.filter((w) => w.id !== id)), 1600);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, ghostScale, screenSize, prefersReduced]);

  if (!visible || isLowEnd) return null;

  const overlayOpacity =
    phase === "idle" ? 0 : phase === "darken" ? 0.65 : phase === "exiting" ? 0 : 0.9;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: overlayOpacity + eventFlash * 0.03,
          x: shakeActive && !prefersReduced ? [0, -3, 4, -2, 2, 0] : 0,
          y: shakeActive && !prefersReduced ? [0, 2, -3, 3, -1, 0] : 0,
        }}
        transition={
          shakeActive && !prefersReduced
            ? { duration: 0.35, ease: "easeInOut" }
            : { duration: 0.8, ease: "easeInOut" }
        }
        style={{
          background: `
            radial-gradient(ellipse at 50% 50%, oklch(0.05 0.01 260 / 0.85) 0%, oklch(0.02 0.005 260 / 0.9) 60%, oklch(0.01 0.003 260 / 0.98) 100%),
            radial-gradient(ellipse at 70% 30%, oklch(0.1 0.02 240 / 0.15) 0%, transparent 60%),
            radial-gradient(ellipse at 30% 70%, oklch(0.08 0.015 220 / 0.1) 0%, transparent 50%)
          `,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.7) 100%)",
          }}
        />
        {!prefersReduced && (
          <>
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: [0, 0.08, 0.04, 0.09, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: `radial-gradient(ellipse at 40% 60%, oklch(0.8 0.03 260 / ${0.12 + eventFlash * 0.04}), transparent 60%)`,
                filter: "blur(50px)",
              }}
            />
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: [0, 0.05, 0.07, 0.03, 0], x: [0, 30, -15, 20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              style={{
                background: `radial-gradient(ellipse at 60% 40%, oklch(0.7 0.04 240 / ${0.1 + eventFlash * 0.03}), transparent 50%)`,
                filter: "blur(70px)",
              }}
            />
          </>
        )}
      </motion.div>

      {/* Shockwaves */}
      {!prefersReduced && (
        <AnimatePresence>
          {shockwaves.map((sw) => (
            <motion.div
              key={sw.id}
              initial={{ opacity: 0.5, scale: 0.3 }}
              animate={{ opacity: 0, scale: 2.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: sw.x,
                top: sw.y,
                width: 40,
                height: 40,
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle, oklch(0.8 0.08 240 / 0.3), transparent 70%)",
                border: "1px solid oklch(0.7 0.1 240 / 0.15)",
                boxShadow: "0 0 30px oklch(0.7 0.1 240 / 0.2)",
                willChange: "transform, opacity",
              }}
            />
          ))}
        </AnimatePresence>
      )}

      {/* Afterimages */}
      {phase !== "exiting" && !prefersReduced && (
        <AnimatePresence>
          {afterimages.map((a) => (
            <motion.div
              key={a.id}
              initial={{ opacity: a.opacity }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute top-0 left-0 pointer-events-none"
              style={{
                transform: `translate3d(${a.x}px, ${a.y}px, 0) translate(-50%, -50%) scale(${a.scale})`,
                filter: `blur(${4 + motionBlur}px)`,
                willChange: "transform, opacity",
              }}
            >
              <GhostLargeSVG
                instanceId={`after-${a.id}`}
                size={Math.min(screenSize.w * 0.35, 260)}
                faceOpacity={0}
                eyeOffX={0}
                glowIntensity={glowIntensity * 0.4}
                aggressive
              />
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {/* Streak particles */}
      {!prefersReduced && (
        <AnimatePresence>
          {streakParticles.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0.7, x: s.x, y: s.y }}
              animate={{ opacity: 0, x: s.x + s.vx * 30, y: s.y + s.vy * 30 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 + Math.random() * 0.3, ease: "easeOut" }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: s.size * 1.5,
                height: s.size * 1.5,
                background: "oklch(0.85 0.1 260 / 0.6)",
                boxShadow: `0 0 ${s.size * 5}px oklch(0.65 0.15 250 / 0.4), 0 0 ${s.size * 10}px oklch(0.6 0.12 250 / 0.15)`,
                willChange: "transform, opacity",
              }}
            />
          ))}
        </AnimatePresence>
      )}

      {/* Mist overlay */}
      {phase !== "idle" && phase !== "exiting" && !prefersReduced && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0, 0.06, 0.03, 0.07, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: `
              radial-gradient(ellipse at 30% 50%, oklch(0.7 0.08 260 / 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 40%, oklch(0.65 0.1 250 / 0.06) 0%, transparent 50%)
            `,
            filter: "blur(60px)",
          }}
        />
      )}

      {/* Ghost entities */}
      {entities.map((entity) => {
        const isMain = !entity.isClone;
        const size = isMain
          ? Math.min(screenSize.w * 0.45, 360)
          : Math.min(screenSize.w * 0.28, 200);

        return (
          <div
            key={entity.id}
            className="absolute top-0 left-0 pointer-events-none"
            ref={(el) => {
              if (el) ghostRefs.current.set(entity.id, el);
              else ghostRefs.current.delete(entity.id);
            }}
            style={{
              transform: `translate3d(${entity.x}px, ${entity.y}px, 0) translate(-50%, -50%) scale(${ghostScale * entity.scale})`,
              opacity: entity.opacity,
              transition: "opacity 0.2s ease",
              willChange: "transform, opacity",
              filter: isMain && !prefersReduced ? `blur(${motionBlur}px)` : "none",
            }}
          >
            <div
              style={{
                transform:
                  isMain && !prefersReduced
                    ? `perspective(800px) rotateY(${headRotY}deg)`
                    : undefined,
                transition: "transform 0.08s ease-out",
                willChange: "transform",
              }}
            >
              <GhostLargeSVG
                size={size}
                faceOpacity={isMain ? faceOpacity : faceOpacity * 0.7}
                eyeOffX={isMain ? eyeOffX : 0}
                glowIntensity={isMain ? glowIntensity : glowIntensity * 0.6}
                aggressive
                expression={entity.expression}
                instanceId={String(entity.id)}
              />
            </div>
          </div>
        );
      })}

      {/* Spooky message */}
      {spookyMessage && (
        <motion.div
          key={spookyMessage}
          initial={{ opacity: 0, scale: 0.6, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.5, filter: "blur(16px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10"
        >
          <motion.span
            className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wide whitespace-nowrap"
            style={{
              color: "oklch(0.9 0.08 260 / 0.85)",
              textShadow:
                "0 0 30px oklch(0.6 0.15 250 / 0.5), 0 0 60px oklch(0.5 0.12 250 / 0.25), 0 0 100px oklch(0.4 0.1 250 / 0.15)",
            }}
          >
            {spookyMessage.split("").map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.08, delay: i * 0.04, ease: "easeOut" }}
              >
                {ch}
              </motion.span>
            ))}
          </motion.span>
        </motion.div>
      )}

      {/* Glow aura */}
      {phase !== "exiting" && !prefersReduced && (
        <motion.div
          className="absolute rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [
              (0.1 + eventFlash * 0.05) * glowIntensity,
              (0.18 + eventFlash * 0.08) * glowIntensity,
              (0.1 + eventFlash * 0.05) * glowIntensity,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: screenSize.w * 0.55,
            height: screenSize.w * 0.55,
            left: "50%",
            top: "45%",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, oklch(0.6 0.12 240 / ${(0.15 + eventFlash * 0.06) * glowIntensity}), transparent 70%)`,
            filter: "blur(50px)",
            willChange: "transform, opacity",
          }}
        />
      )}

      {/* Distortion waves */}
      {!prefersReduced && eventFlash > 0.5 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0, 0.04, 0] }}
          transition={{ duration: 0.5 }}
          style={{
            background:
              "repeating-linear-gradient(90deg, transparent, oklch(0.7 0.1 240 / 0.03) 50%, transparent 100%)",
            backgroundSize: `${20 + eventFlash * 10}px 100%`,
            filter: "blur(2px)",
          }}
        />
      )}

      {/* Whisper texts */}
      {(phase === "speak" || phase === "presence") && !prefersReduced && (
        <AnimatePresence>
          {whispers.map((w) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 0, scale: 0.7, filter: "blur(8px)" }}
              animate={{
                opacity: [0, 0.7, 0.7, 0],
                y: [0, -25, -50],
                scale: [0.7, 1.05, 1],
                filter: ["blur(8px)", "blur(1px)", "blur(5px)"],
              }}
              exit={{
                opacity: 0,
                scale: 0.6,
                filter: "blur(10px)",
                transition: { duration: 0.25 },
              }}
              transition={{ duration: 2.2, ease: "easeOut" }}
              className="absolute pointer-events-none select-none"
              style={{ left: w.x, top: w.y, willChange: "transform, opacity" }}
            >
              <span
                className="block text-base sm:text-lg font-light tracking-wide whitespace-nowrap"
                style={{
                  color: "oklch(0.92 0.03 260 / 0.7)",
                  textShadow:
                    "0 0 16px oklch(0.8 0.06 240 / 0.35), 0 0 40px oklch(0.7 0.08 230 / 0.15)",
                }}
              >
                {w.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {/* Click Me texts */}
      {phase === "presence" && !prefersReduced && (
        <AnimatePresence>
          {clickTexts.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, scale: 0.7, filter: "blur(6px)" }}
              animate={{
                opacity: [0, 0.85, 0.85, 0],
                y: [0, -14, -28],
                scale: [0.7, 1.08, 1],
                filter: ["blur(6px)", "blur(0px)", "blur(3px)"],
              }}
              exit={{ opacity: 0, scale: 0.6, filter: "blur(8px)" }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute pointer-events-none select-none"
              style={{ left: c.x, top: c.y, willChange: "transform, opacity" }}
            >
              <span
                className="block text-sm sm:text-base font-medium tracking-wide whitespace-nowrap"
                style={{
                  color: "oklch(0.92 0.03 260 / 0.85)",
                  textShadow:
                    "0 0 18px oklch(0.6 0.12 240 / 0.4), 0 0 40px oklch(0.6 0.12 240 / 0.15)",
                }}
              >
                {c.id % 2 === 0 ? "Click Me \u{1F440}" : "Click Me..."}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

function GhostLargeSVG({
  size,
  faceOpacity,
  eyeOffX,
  glowIntensity,
  aggressive,
  expression,
  instanceId,
}: {
  size: number;
  faceOpacity: number;
  eyeOffX: number;
  glowIntensity: number;
  aggressive?: boolean;
  expression?: string;
  instanceId?: string;
}) {
  const uid = instanceId ?? String(size);
  const glowColor = aggressive ? "oklch(0.6 0.18 250" : "oklch(0.7 0.15 260";
  const eyeColor = aggressive ? "oklch(0.98 0.1 240" : "oklch(0.95 0.08 250";
  const showSmile = expression === "smile";
  const showIntense = expression === "intense";

  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 160 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <radialGradient id={`ghostGlow-${uid}`} cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor={`${glowColor} / ${0.5 * glowIntensity})`} />
          <stop offset="50%" stopColor={`${glowColor} / ${0.15 * glowIntensity})`} />
          <stop offset="100%" stopColor="oklch(0.5 0.1 250 / 0)" />
        </radialGradient>
        <filter id={`ghostSoft-${uid}`}>
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id={`ghostGlowFilter-${uid}`}>
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`eyeGlowFilter-${uid}`}>
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`ghostBodyGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`oklch(0.95 0.04 260 / ${0.3 * glowIntensity})`} />
          <stop offset="40%" stopColor={`oklch(0.88 0.06 255 / ${0.2 * glowIntensity})`} />
          <stop offset="80%" stopColor={`oklch(0.8 0.08 250 / ${0.1 * glowIntensity})`} />
          <stop offset="100%" stopColor="oklch(0.7 0.1 250 / 0)" />
        </linearGradient>
        <radialGradient id={`eyeSocketGrad-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`${glowColor} / ${0.6 * glowIntensity})`} />
          <stop offset="70%" stopColor={`${glowColor} / ${0.2 * glowIntensity})`} />
          <stop offset="100%" stopColor="oklch(0.4 0.1 250 / 0)" />
        </radialGradient>
      </defs>

      <circle
        cx="80"
        cy="70"
        r="100"
        fill={`url(#ghostGlow-${uid})`}
        filter={`url(#ghostGlowFilter-${uid})`}
        opacity={0.7 * glowIntensity}
      />

      <path
        d="M22 148 V76 C22 26 48 8 80 8 C112 8 138 26 138 76 V148 L130 140 L122 148 L114 140 L106 148 L98 140 L90 148 L82 140 L74 148 L66 140 L58 148 L50 140 L42 148 L34 140 L26 148 L22 140 L22 148 Z"
        fill={`url(#ghostBodyGrad-${uid})`}
        stroke="oklch(0.75 0.1 250 / 0.15)"
        strokeWidth="0.8"
        filter={`url(#ghostSoft-${uid})`}
      />

      <path
        d="M26 145 V76 C26 30 50 12 80 12 C110 12 134 30 134 76 V145 L126 139 L118 145 L110 139 L102 145 L94 139 L86 145 L78 139 L70 145 L62 139 L54 145 L46 139 L38 145 L30 139 L26 145 Z"
        fill="oklch(0.92 0.04 260 / 0.12)"
        stroke="oklch(0.8 0.08 250 / 0.12)"
        strokeWidth="0.5"
      >
        <animate
          attributeName="d"
          values="
            M26 145 V76 C26 30 50 12 80 12 C110 12 134 30 134 76 V145 L126 139 L118 145 L110 139 L102 145 L94 139 L86 145 L78 139 L70 145 L62 139 L54 145 L46 139 L38 145 L30 139 L26 145 Z;
            M26 145 V76 C26 28 50 8 80 8 C110 8 134 28 134 76 V145 L126 139 L118 145 L110 139 L102 145 L94 139 L86 145 L78 139 L70 145 L62 139 L54 145 L46 139 L38 145 L30 139 L26 145 Z;
            M26 145 V76 C26 30 50 12 80 12 C110 12 134 30 134 76 V145 L126 139 L118 145 L110 139 L102 145 L94 139 L86 145 L78 139 L70 145 L62 139 L54 145 L46 139 L38 145 L30 139 L26 145 Z
          "
          dur="3s"
          repeatCount="indefinite"
        />
      </path>

      <g opacity={faceOpacity} style={{ transition: "opacity 0.4s ease" }}>
        <ellipse
          cx="52"
          cy="62"
          rx="22"
          ry="24"
          fill={`url(#eyeSocketGrad-${uid})`}
          filter={`url(#ghostSoft-${uid})`}
        />
        <ellipse
          cx="108"
          cy="62"
          rx="22"
          ry="24"
          fill={`url(#eyeSocketGrad-${uid})`}
          filter={`url(#ghostSoft-${uid})`}
        />

        <ellipse cx="52" cy="62" rx="16" ry="18" fill="oklch(0.01 0.01 260 / 0.95)" />
        <ellipse cx="108" cy="62" rx="16" ry="18" fill="oklch(0.01 0.01 260 / 0.95)" />

        <ellipse
          cx={52 + eyeOffX * 0.7}
          cy="62"
          rx="9"
          ry="11"
          fill={`url(#eyeGlowFilter-${uid})`}
        >
          <animate attributeName="ry" values="11;7;11" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse
          cx={52 + eyeOffX * 0.7}
          cy="62"
          rx="7"
          ry="9"
          fill={`${eyeColor} / ${0.95 * glowIntensity})`}
        >
          <animate attributeName="ry" values="9;5;9" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse
          cx={108 + eyeOffX * 0.7}
          cy="62"
          rx="9"
          ry="11"
          fill={`url(#eyeGlowFilter-${uid})`}
        >
          <animate attributeName="ry" values="11;7;11" dur="2s" repeatCount="indefinite" begin="0.1s" />
        </ellipse>
        <ellipse
          cx={108 + eyeOffX * 0.7}
          cy="62"
          rx="7"
          ry="9"
          fill={`${eyeColor} / ${0.95 * glowIntensity})`}
        >
          <animate attributeName="ry" values="9;5;9" dur="2s" repeatCount="indefinite" begin="0.1s" />
        </ellipse>

        <ellipse
          cx={48 + eyeOffX * 0.5}
          cy="56"
          rx="3.5"
          ry="4"
          fill="oklch(0.98 0.01 260 / 0.8)"
        />
        <ellipse
          cx={104 + eyeOffX * 0.5}
          cy="56"
          rx="3.5"
          ry="4"
          fill="oklch(0.98 0.01 260 / 0.8)"
        />

        {showSmile && (
          <path
            d="M52 98 Q80 118 108 98"
            fill="none"
            stroke="oklch(0.85 0.06 260 / 0.4)"
            strokeWidth="2"
            strokeLinecap="round"
            filter={`url(#ghostSoft-${uid})`}
          >
            <animate
              attributeName="d"
              values="M52 98 Q80 118 108 98;M54 100 Q80 122 106 100;M52 98 Q80 118 108 98"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
        )}

        {showIntense && (
          <>
            <path
              d="M54 90 Q80 100 106 90"
              fill="none"
              stroke="oklch(0.75 0.1 250 / 0.35)"
              strokeWidth="2"
              strokeLinecap="round"
              filter={`url(#ghostSoft-${uid})`}
            />
            <path
              d="M32 78 Q40 72 48 78"
              fill="none"
              stroke="oklch(0.8 0.12 250 / 0.3)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M112 78 Q120 72 128 78"
              fill="none"
              stroke="oklch(0.8 0.12 250 / 0.3)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </>
        )}

        {!showSmile && !showIntense && (
          <path
            d="M58 92 Q80 104 102 92"
            fill="none"
            stroke="oklch(0.8 0.06 250 / 0.2)"
            strokeWidth="1.5"
            strokeLinecap="round"
            filter={`url(#ghostSoft-${uid})`}
          />
        )}
      </g>
    </svg>
  );
}
