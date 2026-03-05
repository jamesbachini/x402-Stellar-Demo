export default function PaywallPage() {
  return (
    <main className="paywall-shell">
      <article className="paywall-card">
        <h1>Payment required</h1>
        <p>
          Access to protected content. To access this content, please pay $0.01
          Stellar testnet USDC.{" "}
          <a
            href="https://faucet.circle.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fund USDC ↗
          </a>
        </p>

        <div className="paywall-details">
          <div className="paywall-row">
            <span>Wallet:</span>
            <span>-</span>
          </div>
          <div className="paywall-row">
            <span>Available balance:</span>
            <span>-</span>
          </div>
          <div className="paywall-row">
            <span>Amount:</span>
            <span>$0.01 USDC</span>
          </div>
          <div className="paywall-row">
            <span>Network:</span>
            <span>Stellar testnet</span>
          </div>
        </div>

        <button className="cta-button paywall-button">Connect Wallet</button>
      </article>
    </main>
  );
}
