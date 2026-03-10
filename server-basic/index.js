import "dotenv/config";
import express from "express";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactStellarScheme } from "@x402/stellar/exact/server";

const app = express();
const PORT = Number.parseInt(process.env.PORT ?? "3001", 10);
const ROUTE_PATH = process.env.ROUTE_PATH ?? "/protected";
const PRICE = process.env.PRICE ?? "$0.01";
const NETWORK = process.env.NETWORK ?? "stellar:testnet";
const FACILITATOR_URL = process.env.FACILITATOR_URL ?? "http://localhost:4022";
const FACILITATOR_API_KEY = process.env.FACILITATOR_API_KEY;
const PAY_TO =
  process.env.PAY_TO ?? "GA4D33Z3EOB6BU4DOXS2JMZK3JQRABN3ERMF3FK5JF5YPG3CEKRI7WM4";

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

app.get("/", (req, res) => {
  res.json({
    name: "x402 Stellar basic server",
    protectedRoute: ROUTE_PATH,
    message: `Send GET ${ROUTE_PATH} with x402 payment headers to access the protected response.`,
  });
});

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
        description: "Access the protected tutorial response",
        mimeType: "application/json",
      },
    },
    resourceServer,
  ),
);

app.get(ROUTE_PATH, (req, res) => {
  res.json({
    ok: true,
    message: "Payment accepted. This is the protected response.",
    route: ROUTE_PATH,
    price: PRICE,
    network: NETWORK,
    payTo: PAY_TO,
  });
});

app.listen(PORT, () => {
  console.log(`x402 basic server listening on http://localhost:${PORT}`);
  console.log(`Public route: GET http://localhost:${PORT}/`);
  console.log(`Protected route: GET http://localhost:${PORT}${ROUTE_PATH}`);
  console.log(`Network: ${NETWORK}`);
  console.log(`Receiver: ${PAY_TO}`);
});
