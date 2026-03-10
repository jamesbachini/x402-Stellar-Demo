# x402 Stellar Demo

Local x402 demo using published npm packages, a Stellar payer client, and a protected Express server.

## Components

- `server`: x402-protected endpoint (`/my-service`)
- `server-basic`: minimal x402-protected endpoint for tutorial use
- `client`: calls endpoint, handles `402`, retries with payment

## Prerequisites

- Node.js `20+`
- `pnpm` `10+`

## Install

```bash
cd ~/x402-Stellar-Demo
pnpm install
```

## Create Env Files

```bash
cd ~/x402-Stellar-Demo
cp server/.env.example server/.env
cp client/.env.example client/.env
```

## Recommended Flow (Pubnet + Hosted Facilitator)

1. Fill `server/.env`:
```dotenv
NETWORK=stellar:pubnet
FACILITATOR_URL=https://channels.openzeppelin.com/x402
FACILITATOR_API_KEY=YOUR_OPENZEPPELIN_API_KEY
STELLAR_RPC_URL=YOUR_PREFERRED_PUBNET_SOROBAN_RPC
PAY_TO=YOUR_PUBNET_RECEIVER_PUBLIC_KEY
PRICE=$0.01
ROUTE_PATH=/my-service
PORT=3000
```
2. Fill `client/.env`:
```dotenv
NETWORK=stellar:pubnet
STELLAR_RPC_URL=YOUR_PREFERRED_PUBNET_SOROBAN_RPC
STELLAR_PRIVATE_KEY=YOUR_PUBNET_CLIENT_SECRET
RESOURCE_SERVER_URL=http://localhost:3000
ENDPOINT_PATH=/my-service
```
3. Validate your API key against the hosted facilitator:
```bash
curl -i -H "Authorization: Bearer YOUR_API_KEY" \
  https://channels.openzeppelin.com/x402/supported
```
4. Run server and client in separate terminals:
```bash
cd ~/x402-Stellar-Demo
pnpm --filter server start
```
```bash
cd ~/x402-Stellar-Demo
pnpm --filter client start
```

## Testnet Flow

This repo no longer vendors a facilitator implementation. For `stellar:testnet`, point `FACILITATOR_URL` at your own facilitator deployment that supports Stellar and keep `NETWORK=stellar:testnet` in both env files.

Example `server/.env`:
```dotenv
NETWORK=stellar:testnet
FACILITATOR_URL=http://localhost:4022
FACILITATOR_API_KEY=
STELLAR_RPC_URL=
PAY_TO=YOUR_TESTNET_RECEIVER_PUBLIC_KEY
PRICE=$0.01
ROUTE_PATH=/my-service
PORT=3000
```

Example `client/.env`:
```dotenv
NETWORK=stellar:testnet
STELLAR_RPC_URL=
STELLAR_PRIVATE_KEY=YOUR_TESTNET_CLIENT_SECRET
RESOURCE_SERVER_URL=http://localhost:3000
ENDPOINT_PATH=/my-service
```

## Notes

- `server` and `client` automatically load their local `.env` files.
- Keep networks aligned between server and client (`stellar:testnet` or `stellar:pubnet`).
- The browser paywall now uses the Freighter extension to sign Stellar auth entries. `STELLAR_RPC_URL` is used as a fallback when the wallet does not provide a Soroban RPC endpoint.
- `@x402/stellar` is consumed directly from npm; the repo no longer depends on a vendored `x402` workspace.
- Do not commit `.env` files with secrets.
