# x402 Stellar Demo

Local x402 demo using a Stellar payer client and a protected Express server.

## Components

- `server`: x402-protected endpoint (`/my-service`)
- `client`: calls endpoint, handles `402`, retries with payment
- `x402/examples/typescript/facilitator/advanced`: local facilitator (used for testnet flow)

## Prerequisites

- Node.js `20+`
- `pnpm` `10+`

## Install

```bash
cd ~/x402-Stellar-Demo
pnpm install

cd ~/x402-Stellar-Demo/x402/examples/typescript
pnpm install
pnpm build
```

## Create Env Files

```bash
cd ~/x402-Stellar-Demo
cp server/.env.example server/.env
cp client/.env.example client/.env
cp x402/examples/typescript/facilitator/advanced/.env.example \
  x402/examples/typescript/facilitator/advanced/.env
```

## Testnet Flow (Local Facilitator)

1. Fill `x402/examples/typescript/facilitator/advanced/.env`:
```dotenv
STELLAR_PRIVATE_KEY=YOUR_TESTNET_FACILITATOR_SECRET
PORT=4022
```
2. Fill `server/.env`:
```dotenv
NETWORK=stellar:testnet
FACILITATOR_URL=http://localhost:4022
FACILITATOR_API_KEY=
PAY_TO=YOUR_TESTNET_RECEIVER_PUBLIC_KEY
PRICE=$0.01
ROUTE_PATH=/my-service
PORT=3000
```
3. Fill `client/.env`:
```dotenv
NETWORK=stellar:testnet
STELLAR_PRIVATE_KEY=YOUR_TESTNET_CLIENT_SECRET
RESOURCE_SERVER_URL=http://localhost:3000
ENDPOINT_PATH=/my-service
```
4. Run in three terminals:
```bash
cd ~/x402-Stellar-Demo/x402/examples/typescript/facilitator/advanced
pnpm dev:all-networks
```
```bash
cd ~/x402-Stellar-Demo
pnpm --filter server start
```
```bash
cd ~/x402-Stellar-Demo
pnpm --filter client start
```

## Mainnet (Pubnet) Flow With OpenZeppelin Hosted Facilitator

As of March 5, 2026, `https://channels.openzeppelin.com/x402/supported` advertises `stellar:pubnet`.

1. Validate your key:
```bash
curl -i -H "Authorization: Bearer YOUR_API_KEY" \
  https://channels.openzeppelin.com/x402/supported
```
2. Fill `server/.env`:
```dotenv
NETWORK=stellar:pubnet
FACILITATOR_URL=https://channels.openzeppelin.com/x402
FACILITATOR_API_KEY=YOUR_OPENZEPPELIN_API_KEY
PAY_TO=YOUR_PUBNET_RECEIVER_PUBLIC_KEY
PRICE=$0.01
ROUTE_PATH=/my-service
PORT=3000
```
3. Fill `client/.env`:
```dotenv
NETWORK=stellar:pubnet
STELLAR_PRIVATE_KEY=YOUR_PUBNET_CLIENT_SECRET
RESOURCE_SERVER_URL=http://localhost:3000
ENDPOINT_PATH=/my-service
```
4. Run only server and client in separate terminals (no local facilitator required):
```bash
cd ~/x402-Stellar-Demo
pnpm --filter server start
```
```bash
cd ~/x402-Stellar-Demo
pnpm --filter client start
```

## Notes

- `server` and `client` automatically load their local `.env` files.
- Keep networks aligned between server and client (`stellar:testnet` or `stellar:pubnet`).
- Do not commit `.env` files with secrets.
