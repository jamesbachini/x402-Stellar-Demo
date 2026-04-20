import express from "express";
import { paymentMiddlewareFromConfig } from "@x402/express";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactStellarScheme } from "@x402/stellar/exact/server";

const NETWORK = "stellar:testnet";
const FACILITATOR_URL = "https://www.x402.org/facilitator";
const PAY_TO = "G...YOURADDRESS...";
const app = express();

app.use(
  paymentMiddlewareFromConfig(
    {
      [`GET /my-service`]: {
        accepts: {scheme: "exact", price: "$0.01", network: NETWORK, payTo: PAY_TO}
      }
    },
    new HTTPFacilitatorClient({ url: FACILITATOR_URL }),
    [{ network: NETWORK, server: new ExactStellarScheme() }],
  ),
);
app.get("/my-service", (_, res) => res.json({ secret: "valuable content" }));

app.listen(3003);
