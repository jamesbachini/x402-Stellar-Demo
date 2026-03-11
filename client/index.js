import dotenv from "dotenv";
import { Transaction } from "@stellar/stellar-sdk";
import { x402Client, x402HTTPClient } from "@x402/fetch";
import { createEd25519Signer, getNetworkPassphrase } from "@x402/stellar";
import { ExactStellarScheme } from "@x402/stellar/exact/client";
import { fileURLToPath } from "node:url";
import { enableAllowHttpForInsecureSorobanRpc } from "./allow-http-rpc.js";

dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)), quiet: true });
enableAllowHttpForInsecureSorobanRpc();

const STELLAR_PRIVATE_KEY = process.env.STELLAR_PRIVATE_KEY;
const RESOURCE_SERVER_URL = "http://localhost:3001";
const ENDPOINT_PATH = "/my-service";
const NETWORK = "stellar:testnet";
const STELLAR_RPC_URL = "https://soroban-testnet.stellar.org";

function getStellarTransactionFee(paymentPayload) {
  const transactionXdr = paymentPayload?.payload?.transaction;
  if (typeof transactionXdr !== "string") return null;
  try {
    const tx = new Transaction(transactionXdr, getNetworkPassphrase(NETWORK));
    return Number(tx.fee);
  } catch {
    return null;
  }
}

function describePaymentFailure(paymentRequired, txFee) {

  return `Payment rejected: ${JSON.stringify(paymentRequired)}`;
}

async function main() {
  if (!STELLAR_PRIVATE_KEY) {
    throw new Error("STELLAR_PRIVATE_KEY is required.");
  }

  const url = new URL(ENDPOINT_PATH, RESOURCE_SERVER_URL).toString();
  const signer = createEd25519Signer(STELLAR_PRIVATE_KEY, NETWORK);
  const rpcConfig = STELLAR_RPC_URL ? { url: STELLAR_RPC_URL } : undefined;
  const client = new x402Client().register("stellar:*", new ExactStellarScheme(signer, rpcConfig));
  const httpClient = new x402HTTPClient(client);
  console.log(`Target: ${url}\nClient address: ${signer.address}`);
  const firstTry = await fetch(url, { method: "GET" });
  console.log(`Payment requested: ${firstTry.status}`);
  const paymentRequired = httpClient.getPaymentRequiredResponse(name => firstTry.headers.get(name));
  const paymentPayload = await client.createPaymentPayload(paymentRequired);
  const txFee = getStellarTransactionFee(paymentPayload);
  if (txFee != null) {
    console.log(`Stellar tx fee: ${txFee} stroops`);
  }

  const paymentHeaders = httpClient.encodePaymentSignatureHeader(paymentPayload);
  const paidResponse = await fetch(url, { method: "GET", headers: paymentHeaders });
  const text = await paidResponse.text();

  if (!paidResponse.ok) {
    let retryPaymentRequired;
    try {
      retryPaymentRequired = httpClient.getPaymentRequiredResponse(name => paidResponse.headers.get(name));
    } catch {
      retryPaymentRequired = null;
    }
    console.error(`Paid retry failed with ${paidResponse.status}. ${describePaymentFailure(retryPaymentRequired, txFee)}`);
    console.error(`Response body: "${text}"`);
    return;
  }
  console.log(`Access Granted! ${paidResponse.status} "${text}"`);
  const paymentResponse = httpClient.getPaymentSettleResponse(name => paidResponse.headers.get(name));
  console.log("Settlement response:", paymentResponse);
}

main().catch(error => {
  console.error("Client failed:", error);
  process.exit(1);
});
