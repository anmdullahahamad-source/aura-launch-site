import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LanguageProvider, useLanguage } from "../lib/i18n";
import { useTranslation } from "../lib/i18n";
import { ThemeProvider } from "../lib/theme";
import { CommandCenterProvider } from "../components/CommandCenter";
import { InteractionProvider, useFeatureRegistration, useFeatureActivation } from "../interactions";
import LOADING_EXPERIENCE_FEATURE from "../interactions/features/loadingExperience";
import { PageLoader } from "../components/PageLoader";
import { RocketTrail } from "../components/RocketTrail";
import { BgParticles } from "../components/BgParticles";
import SECTION_INTERACTION_HUB_FEATURE from "../interactions/features/sectionInteractionHub";

function NotFoundComponent() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">{t("error.404title")}</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t("error.404heading")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("error.404desc")}
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("error.goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { t } = useTranslation();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {t("error.errorHeading")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("error.errorDesc")}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("error.tryAgain")}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {t("error.goHome")}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0d2a22" },
      { name: "author", content: "Ibrahim Khalil" },
      { property: "og:site_name", content: "Ibrahim Khalil" },
      { title: "Ibrahim Khalil" },
      { property: "og:title", content: "Ibrahim Khalil" },
      { name: "twitter:title", content: "Ibrahim Khalil" },
      {
        name: "description",
        content:
          "Ibrahim Khalil — Student, Marketing Officer & Youth Leader from Trishal, Mymensingh.",
      },
      {
        property: "og:description",
        content:
          "Ibrahim Khalil — Student, Marketing Officer & Youth Leader from Trishal, Mymensingh.",
      },
      {
        name: "twitter:description",
        content:
          "Ibrahim Khalil — Student, Marketing Officer & Youth Leader from Trishal, Mymensingh.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5428dbe4-5b36-4d62-9e11-7799bf51af3d/id-preview-c544ebdf--8f1700e6-15af-4e9e-95b3-1315107004cf.lovable.app-1781845920193.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5428dbe4-5b36-4d62-9e11-7799bf51af3d/id-preview-c544ebdf--8f1700e6-15af-4e9e-95b3-1315107004cf.lovable.app-1781845920193.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem("theme");if(!t){t=window.matchMedia("(prefers-color-scheme:light)").matches?"light":"dark"}document.documentElement.dataset.theme=t==="light"?"light":"";var low=!1;if(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<4)low=!0;if(navigator.deviceMemory&&navigator.deviceMemory<4)low=!0;if(window.innerWidth<480)low=!0;if(low)document.documentElement.dataset.lowEnd="true"}catch(e){}}())`,
        }} />
      </head>
      <body>
        <a
          href="#main-content"
          className="fixed -top-full left-4 z-[10001] rounded-b-lg bg-gold px-4 py-2 text-sm font-medium text-background transition-all focus:top-0 outline-none"
        >
          Skip to content
        </a>
        <BgParticles />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function LoadingGate({ children }: { children: ReactNode }) {
  useFeatureRegistration(LOADING_EXPERIENCE_FEATURE, []);
  useFeatureActivation("loading-experience", true);

  useFeatureRegistration(SECTION_INTERACTION_HUB_FEATURE, []);
  useFeatureActivation("section-interaction-hub", true);

  return <>{children}</>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <LanguageProvider>
      <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <InteractionProvider>
          <CommandCenterProvider>
            <LoadingGate>
              <PageLoader />
              <Outlet />
              <RocketTrail />
            </LoadingGate>
          </CommandCenterProvider>
        </InteractionProvider>
      </QueryClientProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
