import { useTranslation } from "../../lib/i18n";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="relative py-8 sm:py-12 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col items-center gap-2 text-center">
        <div className="text-xs sm:text-sm text-muted-foreground">
          © {new Date().getFullYear()} {t("footer.copyright")}
        </div>
        <a
          href="https://www.facebook.com/profile.php?id=61565957914850"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] tracking-wider text-muted-foreground/40 hover:text-gold transition-colors"
        >
          See Developer
        </a>
      </div>
    </footer>
  );
}
