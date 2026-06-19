export function Footer() {
  return (
    <footer className="relative py-12 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Ibrahim Khalil. Built for the people of Mathbari.
        </div>
        <div className="text-xs text-muted-foreground uppercase tracking-widest">
          Trishal · Mymensingh · Bangladesh
        </div>
      </div>
    </footer>
  );
}
