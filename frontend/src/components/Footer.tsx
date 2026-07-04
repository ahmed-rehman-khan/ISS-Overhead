export default function Footer() {
  return (
    <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 md:px-10 py-4 border-t border-glow-blue/15 bg-space-black/80">
      <div className="flex gap-4 sm:gap-5">
        <a href="/privacy" className="text-[11px] sm:text-[12px] text-text-muted hover:text-text-secondary transition-colors font-medium">
          Privacy Policy
        </a>
        <a href="/unsubscribe" className="text-[11px] sm:text-[12px] text-text-muted hover:text-text-secondary transition-colors font-medium">
          Unsubscribe
        </a>
      </div>
      <p className="font-mono text-[9px] sm:text-[10px] text-text-muted tracking-[1px] text-center sm:text-left">
        ISSOVERHEAD · AHMED REHMAN · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
