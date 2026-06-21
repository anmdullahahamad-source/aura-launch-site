import { useEffect, useState } from "react";

let cached: boolean | null = null;

function detect(): boolean {
  let lowEnd = false;
  const cores = navigator.hardwareConcurrency;
  if (cores && cores < 4) lowEnd = true;
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  if (mem && mem < 4) lowEnd = true;
  if (window.innerWidth < 480) lowEnd = true;
  if (
    "connection" in navigator &&
    (navigator as unknown as { connection?: { effectiveType?: string } }).connection
      ?.effectiveType === "2g"
  ) {
    lowEnd = true;
  }
  return lowEnd;
}

export function useIsLowEndDevice(): boolean {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    if (cached !== null) {
      if (cached !== isLowEnd) setIsLowEnd(cached);
      return;
    }
    cached = detect();
    setIsLowEnd(cached);
    if (cached) {
      document.documentElement.dataset.lowEnd = "true";
    }
  }, []);

  return isLowEnd;
}
