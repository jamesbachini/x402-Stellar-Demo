import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-shell">
        <Link href="/" className="brand-link">
          <span className="stellar-mark" aria-hidden />
          <span className="brand-name">Stellar</span>
          <span className="x402-pill">x402</span>
        </Link>
        <Link href="/demo" className="cta-button cta-small">
          Try the demo
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        Powered by <a href="https://x402.org">x402</a> on{" "}
        <a href="https://stellar.org">Stellar</a>
      </p>
    </footer>
  );
}
