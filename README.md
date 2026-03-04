# x402 Stellar Demo

Local demo for the x402 payment flow on Stellar testnet.

## What this repo runs

- `facilitator`: x402 advanced facilitator (port `4022`)
- `app`: x402-protected Express endpoint (port `3000`)
- `client`: caller that retries with x402 payment

## Prerequisites

- Node.js `20+`
- `pnpm` `10+`

## Installation

1. Install root workspace dependencies:

```bash
cd ~/x402-Stellar-Demo
pnpm install
```

2. Install and build the examples workspace (used by the facilitator command):

```bash
cd ~/x402-Stellar-Demo/x402/examples/typescript
pnpm install
pnpm build
```

3. Configure facilitator env:

Create or update `~/x402-Stellar-Demo/x402/examples/typescript/facilitator/advanced/.env` with a new key.

You can generate and fund a key at: https://lab.stellar.org/account/create?$=network$id=testnet

```bash
STELLAR_PRIVATE_KEY=YOUR_STELLAR_TESTNET_SECRET
PORT=4022
```

## Run the demo

Start each process in a separate terminal, in this order:

1. Facilitator

```bash
~/x402-Stellar-Demo/x402/examples/typescript/facilitator/advanced$ pnpm dev:all-networks
```

2. App

```bash
~/x402-Stellar-Demo$ pnpm --filter app start
```

3. Client

```bash
~/x402-Stellar-Demo$ pnpm --filter client start
```

The client should first receive `402`, then retry with payment and get a successful response.
