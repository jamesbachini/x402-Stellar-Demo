import "dotenv/config";
import express from "express";
import { paymentMiddlewareFromConfig } from "@x402/express";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactStellarScheme } from "@x402/stellar/exact/server";

const NETWORK = "stellar:pubnet";
const PAY_TO = "GA4D33Z3EOB6BU4DOXS2JMZK3JQRABN3ERMF3FK5JF5YPG3CEKRI7WM4";
const app = express();
const paymentMethod = { scheme: "exact", price: "$0.01", network: NETWORK, payTo: PAY_TO }

const facilitatorClient = new HTTPFacilitatorClient({
  url: "https://channels.openzeppelin.com/x402",
  createAuthHeaders: async () => {
    const headers = { Authorization: `Bearer ${process.env.OZ_API_KEY}` };
    return { verify: headers, settle: headers, supported: headers };
  },
});

app.use(
  paymentMiddlewareFromConfig(
    {[`GET /secret`]: { accepts: paymentMethod }},
    facilitatorClient,
    [{ network: NETWORK, server: new ExactStellarScheme() }],
  ),
);
app.get("/secret", (_, res) => res.json({ secret_number: 12345 }));
app.listen(3003);
console.log(`Server started. Connect to http://localhost:3003/secret`);
