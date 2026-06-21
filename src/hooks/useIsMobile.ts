import { useEffect, useState } from "react";

let sharedState = false;
const subscribers = new Set<(v: boolean) => void>();
let initialized = false;

function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  const check = () => {
    const next = window.innerWidth < 768;
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    init();
    subscribers.add(setIsMobile);
    if (sharedState !== isMobile) {
      setIsMobile(sharedState);
    }
    return () => {
      subscribers.delete(setIsMobile);
    };
  }, []);

  return isMobile;
}
