import { useEffect, useState } from "react";
import { loadingState } from "../interactions/features/loadingExperience";
import { useTranslation } from "../lib/i18n";

export function PageLoader() {
  const [show, setShow] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    loadingState.setDispatch({
      onPageReady: () => {},
    });
    const timer = setTimeout(() => {
      setShow(false);
      loadingState.pageLoaded = true;
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
      role="status"
      aria-label="Loading"
      style={{ background: "oklch(0.15 0.04 165)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="grid h-14 w-14 place-items-center rounded-2xl"
          style={{
            background: "linear-gradient(135deg, oklch(0.85 0.14 88), oklch(0.65 0.16 75))",
            boxShadow: "0 0 40px -8px oklch(0.78 0.14 85 / 0.3)",
          }}
        >
          <span
            className="font-display text-2xl font-bold"
            style={{ color: "oklch(0.15 0.04 165)" }}
          >
            I
          </span>
        </div>
        <div className="text-center">
          <p
            className="font-display text-lg font-semibold tracking-wide"
            style={{ color: "oklch(0.85 0.14 88)" }}
          >
            Ibrahim Khalil
          </p>
          <p
            className="text-[11px] tracking-[0.2em] uppercase mt-1"
            style={{ color: "oklch(0.78 0.14 85 / 0.5)" }}
          >
            {t("pageLoader.loading")}
          </p>
        </div>
      </div>
    </div>
  );
}
