import express from "express";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import { createPaywall } from "@x402/paywall";

const PORT = Number(process.env.PORT ?? 3000);
const FACILITATOR_URL = process.env.FACILITATOR_URL ?? "http://localhost:4022";
const PAY_TO =
  process.env.PAY_TO ?? "GA4D33Z3EOB6BU4DOXS2JMZK3JQRABN3ERMF3FK5JF5YPG3CEKRI7WM4";
const PRICE = process.env.PRICE ?? "$0.10";
const NETWORK = "stellar:testnet";
const ROUTE_PATH = "/my-service";
const APP_NAME = process.env.PAYWALL_APP_NAME ?? "x402 Stellar Demo";

const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
const resourceServer = new x402ResourceServer(facilitatorClient).register(
  NETWORK,
  new ExactStellarScheme(),
);

const app = express();

const stellarPaywall = {
  supports: requirement => requirement.network.startsWith("stellar:"),
  generateHtml: (requirement, paymentRequired, config) => {
    const title = config?.appName || APP_NAME;
    const amount = Number(requirement.amount) / 10 ** 7;
    const description = paymentRequired.resource?.description || "Protected content";

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} - Payment Required</title>
    <style>
      body { margin: 0; font-family: system-ui, sans-serif; background: #f8fafc; color: #0f172a; }
      .wrap { max-width: 720px; margin: 5rem auto; background: #ffffff; border-radius: 12px; padding: 2rem; box-shadow: 0 8px 30px rgba(0,0,0,.08); }
      h1 { margin: 0 0 1rem; font-size: 1.5rem; }
      p { line-height: 1.5; }
      .card { background: #f1f5f9; border-radius: 10px; padding: 1rem; margin: 1rem 0; }
      code { background: #e2e8f0; padding: .1rem .4rem; border-radius: 6px; }
    </style>
  </head>
  <body>
    <main class="wrap">
      <h1>Payment Required</h1>
      <p><strong>${description}</strong></p>
      <div class="card">
        <p><strong>Amount:</strong> $${amount.toFixed(2)} USDC</p>
        <p><strong>Network:</strong> ${requirement.network}</p>
        <p><strong>Pay to:</strong> <code>${requirement.payTo}</code></p>
      </div>
    </main>
  </body>
</html>`;
  },
};

const customPaywall = createPaywall()
  .withNetwork(stellarPaywall)
  .withConfig({
    appName: APP_NAME,
    testnet: true,
  })
  .build();

app.use(
  paymentMiddleware(
    {
      [`GET ${ROUTE_PATH}`]: {
        accepts: {
          scheme: "exact",
          price: PRICE,
          network: NETWORK,
          payTo: PAY_TO,
        },
        description: "Access to premium content",
        mimeType: "application/json",
      },
    },
    resourceServer,
    {
      appName: APP_NAME,
      testnet: true,
    },
    customPaywall,
  ),
);

app.get(ROUTE_PATH, (req, res) => {
  res.json({
    message: "This content is behind a paywall",
    network: NETWORK,
    payTo: PAY_TO,
    facilitator: FACILITATOR_URL,
  });
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`x402 demo app listening on http://localhost:${PORT}`);
  console.log(`Protected route: GET ${ROUTE_PATH}`);
  console.log(`Network: ${NETWORK}`);
  console.log(`Facilitator: ${FACILITATOR_URL}`);
  console.log(`Pay-to: ${PAY_TO}`);
  console.log(`Paywall app name: ${APP_NAME}`);
});
