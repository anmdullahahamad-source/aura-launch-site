import { useEffect, useState } from "react";

const breakpoint = 768;
let sharedState = false;
const subscribers = new Set<(v: boolean) => void>();
let initialized = false;

function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  const check = () => {
    const next = window.innerWidth < breakpoint;
    if (next !== sharedState) {
      sharedState = next;
      subscribers.forEach((fn) => fn(next));
    }
  };
  check();
  let timer: ReturnType<typeof setTimeout>;
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(check, 100);
  }, { passive: true });
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(sharedState);

  useEffect(() => {
    init();
    subscribers.add(setIsMobile);
    return () => {
      subscribers.delete(setIsMobile);
    };
  }, []);

  return isMobile;
}
