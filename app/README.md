# x402 Stellar Demo App

Express API protected by x402 middleware on Stellar testnet.

## Run

```bash
pnpm --filter app start
```

## Environment Variables

- `PORT` (default: `3000`)
- `FACILITATOR_URL` (default: `http://localhost:4022`)
- `PAY_TO` (default: `GA4D33Z3EOB6BU4DOXS2JMZK3JQRABN3ERMF3FK5JF5YPG3CEKRI7WM4`)
- `PRICE` (default: `$0.10`)

## Endpoints

- `GET /health` (free)
- `GET /my-service` (x402 protected)
