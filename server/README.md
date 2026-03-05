# x402 Stellar Demo Server

Express API protected by x402 middleware.

## Setup

```bash
cp .env.example .env
```

## Environment Variables

- `PORT` (default: `3000`)
- `ROUTE_PATH` (default: `/my-service`)
- `PRICE` (default: `$0.01`)
- `PAY_TO` (required for real settlement)
- `NETWORK` (default: `stellar:testnet`)
- `FACILITATOR_URL` (default: `http://localhost:4022`)
- `FACILITATOR_API_KEY` (required when `FACILITATOR_URL` is OpenZeppelin hosted URL, sent as `Authorization: Bearer <key>`)

## Run

```bash
pnpm --filter server start
```

## Endpoints

- `GET /my-service` (x402 protected by default route config)
