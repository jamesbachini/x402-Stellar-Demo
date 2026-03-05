import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/site-chrome";

const howItWorks = [
  "Click the button below to request the protected resource.",
  "The server responds with HTTP 402 and a paywall page. Connect a compatible wallet (e.g. Freighter browser extension).",
  "Approve a $0.01 USDC payment on Stellar testnet.",
  "The facilitator verifies and settles the payment on-chain. The content unlocks automatically.",
];

const prerequisites = [
  "A wallet that supports auth-entry signing (e.g. Freighter browser extension, Albedo, Hana)",
  "A funded Stellar testnet account with the USDC trustline - to fund it or add a trustline, go to Stellar Laboratory.",
  "Testnet USDC tokens - get them from the Circle Faucet (select Stellar network)",
];

export default function DemoPage() {
  return (
    <div className="page-surface">
      <SiteHeader />

      <main className="demo-content">
        <Link href="/" className="back-chip" aria-label="Back to landing page">
          ←
        </Link>

        <section className="demo-hero">
          <h1>Try the Paywall Demo</h1>
          <p>
            This demo gates a page behind a $0.01 USDC micropayment on Stellar
            testnet. When you request the protected resource, the server returns
            HTTP 402 with a paywall page where you can sign and submit the
            payment.
          </p>
          <Link href="/protected" className="cta-button">
            Access Protected Content <span aria-hidden>→</span>
          </Link>
        </section>

        <section className="panel-card">
          <h2>How it works</h2>
          <ol className="bullet-step-list">
            {howItWorks.map((step, index) => (
              <li key={step}>
                <span className="circle-index">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="panel-card">
          <h2>Prerequisites</h2>
          <ul className="dot-list">
            {prerequisites.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
