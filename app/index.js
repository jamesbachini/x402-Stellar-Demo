import express from "express";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactStellarScheme } from "@x402/stellar/exact/server";

const app = express();
const PORT = 3000;
const FACILITATOR_URL = "http://localhost:4022";
const PAY_TO = "GA4D33Z3EOB6BU4DOXS2JMZK3JQRABN3ERMF3FK5JF5YPG3CEKRI7WM4";
const PRICE = "$0.01";
const NETWORK = "stellar:testnet";
const ROUTE_PATH = "/my-service";
const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
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
  console.log(`x402 demo app listening on `);
  console.log(`Route: GET http://localhost:${PORT}${ROUTE_PATH}`);
  console.log(`Network: ${NETWORK}`);
  console.log(`Receiver: ${PAY_TO}`);
});
