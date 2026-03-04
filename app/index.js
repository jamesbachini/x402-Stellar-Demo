import express from "express";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactStellarScheme } from "@x402/stellar/exact/server";

const PORT = Number(process.env.PORT ?? 3000);
const FACILITATOR_URL = process.env.FACILITATOR_URL ?? "http://localhost:4022";
const PAY_TO =
  process.env.PAY_TO ?? "GA4D33Z3EOB6BU4DOXS2JMZK3JQRABN3ERMF3FK5JF5YPG3CEKRI7WM4";
const PRICE = process.env.PRICE ?? "$0.10";
const NETWORK = "stellar:testnet";
const ROUTE_PATH = "/my-service";

const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
const resourceServer = new x402ResourceServer(facilitatorClient).register(
  NETWORK,
  new ExactStellarScheme(),
);

const app = express();

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
});
