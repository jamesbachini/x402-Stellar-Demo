import Link from "next/link";
import { SiteFooter, SiteHeader } from "./components/site-chrome";

const howItWorksSteps = [
  "Client requests a protected resource from the server.",
  "Server responds with HTTP 402 and payment requirements (asset, amount, recipient).",
  "Client builds a Soroban transfer() call, signs the authorization entries, and sends the transaction in the request header.",
  "Server forwards the payment to a facilitator, which verifies and settles it on Stellar.",
  "Server returns 200 OK with the requested content.",
];

const wallets = [
  "Freighter (browser extension) ↗",
  "Albedo ↗",
  "Hana ↗",
  "HOT ↗",
  "Kievr ↗",
  "One Key ↗",
];

const resourceCards = [
  {
    title: "Stellar x402 Spec",
    body: "The exact scheme specification for Stellar, defining the protocol flow and facilitator verification rules.",
    href: "https://github.com/stellar/stellar-protocol/blob/master/core/cap-0046.md",
  },
  {
    title: "Stellar x402 Docs",
    body: "Official Stellar developer documentation for building x402-enabled apps.",
    href: "https://developers.stellar.org",
  },
  {
    title: "@x402/stellar Package",
    body: "The pull request adding Stellar blockchain support to the x402 protocol (client, facilitator, and server).",
    href: "https://github.com/coinbase/x402",
  },
  {
    title: "x402 Protocol",
    body: "The x402 protocol by Coinbase - HTTP-native payments for the open web.",
    href: "https://x402.org",
  },
];

export default function LandingPage() {
  return (
    <div className="page-surface">
      <SiteHeader />

      <main className="page-content">
        <section className="hero">
          <h1>x402 on Stellar</h1>
          <p>
            HTTP-native payments on the Stellar network. This demo shows a
            working paywall powered by the x402 protocol and Soroban smart
            contracts.
          </p>
          <Link href="/demo" className="cta-button">
            Try the demo <span aria-hidden>→</span>
          </Link>
        </section>

        <section className="three-up-grid">
          <article className="panel-card">
            <h2>Stellar + USDC</h2>
            <p>
              Payments settle in ~5 seconds on Stellar using Soroban token
              contracts. This demo uses USDC on testnet.
            </p>
          </article>
          <article className="panel-card">
            <h2>HTTPS 402 Protocol</h2>
            <p>
              x402 activates the dormant HTTP 402 status code. Clients pay for
              resources via request headers-no accounts, no OAuth, no
              subscriptions.
            </p>
          </article>
          <article className="panel-card">
            <h2>Micropayments &amp; AI Agents</h2>
            <p>
              Gate any API or page behind a per-request payment. Designed for
              both human users and autonomous agents.
            </p>
          </article>
        </section>

        <section className="centered-block">
          <h3>How x402 Works</h3>
          <ol className="step-list">
            {howItWorksSteps.map((step, index) => (
              <li key={step}>
                <span className="step-index">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="centered-block">
          <h3>Compatible Wallets</h3>
          <p className="section-copy">
            x402 on Stellar requires wallets that support auth-entry signing
            (Soroban authorization entry signing).
          </p>
          <div className="chip-row">
            {wallets.map(wallet => (
              <span key={wallet} className="chip">
                {wallet}
              </span>
            ))}
          </div>
        </section>

        <section className="centered-block">
          <h3>Facilitator</h3>
          <span className="status-chip">Coming soon</span>
          <div className="panel-card single">
            <p>
              <a href="https://openzeppelin.com">OpenZeppelin</a> is building a
              hosted Stellar facilitator using their{" "}
              <a href="https://github.com/OpenZeppelin/openzeppelin-relayer">
                Relayer x402 Facilitator Plugin
              </a>
              . Once live, you will be able to point your server at their
              facilitator URL instead of running your own.
            </p>
          </div>
        </section>

        <section className="centered-block">
          <h3>Resources</h3>
          <div className="resource-grid">
            {resourceCards.map(card => (
              <a
                key={card.title}
                className="panel-card resource-link"
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h4>{card.title}</h4>
                <p>{card.body}</p>
              </a>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
