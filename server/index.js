import "dotenv/config";
import express from "express";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactStellarScheme } from "@x402/stellar/exact/server";

const app = express();
const PORT = Number.parseInt(process.env.PORT ?? "3000", 10);
const FACILITATOR_URL = process.env.FACILITATOR_URL ?? "http://localhost:4022";
const FACILITATOR_API_KEY = process.env.FACILITATOR_API_KEY;
const PAY_TO =
  process.env.PAY_TO ?? "GA4D33Z3EOB6BU4DOXS2JMZK3JQRABN3ERMF3FK5JF5YPG3CEKRI7WM4";
const PRICE = process.env.PRICE ?? "$0.01";
const NETWORK = process.env.NETWORK ?? "stellar:testnet";
const ROUTE_PATH = process.env.ROUTE_PATH ?? "/my-service";

if (FACILITATOR_URL.includes("channels.openzeppelin.com") && !FACILITATOR_API_KEY) {
  console.error(
    "FACILITATOR_API_KEY is required when using OpenZeppelin hosted facilitator URL.",
  );
  process.exit(1);
}

const facilitatorClient = new HTTPFacilitatorClient({
  url: FACILITATOR_URL,
  createAuthHeaders: FACILITATOR_API_KEY
    ? async () => ({
        verify: { Authorization: `Bearer ${FACILITATOR_API_KEY}` },
        settle: { Authorization: `Bearer ${FACILITATOR_API_KEY}` },
        supported: { Authorization: `Bearer ${FACILITATOR_API_KEY}` },
      })
    : undefined,
});
const resourceServer = new x402ResourceServer(facilitatorClient).register(
  NETWORK,
  new ExactStellarScheme(),
);

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
    undefined,
    undefined,
  ),
);

app.get(ROUTE_PATH, (req, res) => {
  res.json({
    message: "Secret valuable content here",
    network: NETWORK,
    payTo: PAY_TO,
    facilitator: FACILITATOR_URL,
  });
});

app.listen(PORT, () => {
  console.log(`x402 demo server listening on `);
  console.log(`Route: GET http://localhost:${PORT}${ROUTE_PATH}`);
  console.log(`Network: ${NETWORK}`);
  console.log(`Receiver: ${PAY_TO}`);
});
