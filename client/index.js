import { x402Client, wrapFetchWithPayment, x402HTTPClient } from "@x402/fetch";
import { createEd25519Signer } from "@x402/stellar";
import { ExactStellarScheme } from "@x402/stellar/exact/client";

const RESOURCE_SERVER_URL = process.env.RESOURCE_SERVER_URL ?? "http://localhost:3000";
const ENDPOINT_PATH = process.env.ENDPOINT_PATH ?? "/my-service";
const STELLAR_PRIVATE_KEY =
  process.env.STELLAR_PRIVATE_KEY ??
  "SBOIAB3VOCODRQDD35RNMBWNUYSFNIGSTVIMBSW73AUTTNQZOIKYAN3T";

async function main() {
  const url = new URL(ENDPOINT_PATH, RESOURCE_SERVER_URL).toString();

  const signer = createEd25519Signer(STELLAR_PRIVATE_KEY, "stellar:testnet");
  const client = new x402Client().register("stellar:*", new ExactStellarScheme(signer));
  const fetchWithPayment = wrapFetchWithPayment(fetch, client);

  console.log(`Target: ${url}`);
  console.log(`Client address: ${signer.address}`);

  const firstTry = await fetch(url, { method: "GET" });
  console.log(`Initial response (no payment): ${firstTry.status}`);

  const paidResponse = await fetchWithPayment(url, { method: "GET" });
  const text = await paidResponse.text();

  console.log(`Paid response status: ${paidResponse.status}`);

  try {
    console.log("Body:", JSON.parse(text));
  } catch {
    console.log("Body:", text);
  }

  if (paidResponse.ok) {
    const paymentResponse = new x402HTTPClient(client).getPaymentSettleResponse(name =>
      paidResponse.headers.get(name),
    );
    console.log("Payment response:", paymentResponse);
  } else {
    console.log("Paid response headers:", Object.fromEntries(paidResponse.headers.entries()));
  }
}

main().catch(error => {
  console.error("Client failed:", error?.message ?? error);
  process.exit(1);
});
