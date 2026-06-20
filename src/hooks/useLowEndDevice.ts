import { useEffect, useState } from "react";

export function useLowEndDevice(): boolean {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? Infinity;
    const memory =
      (navigator as unknown as Record<string, number | undefined>).deviceMemory ?? Infinity;
    setIsLowEnd(cores < 4 || memory < 4);
  }, []);

  return isLowEnd;
}
