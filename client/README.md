# x402 Stellar Demo Client

Node.js client that calls the protected endpoint and retries automatically with x402 payment.

## Run

```bash
pnpm --filter client start
```

## Environment Variables

- `RESOURCE_SERVER_URL` (default: `http://localhost:3000`)
- `ENDPOINT_PATH` (default: `/my-service`)
- `STELLAR_PRIVATE_KEY` (default: `SCGARZH7OQQRNWMDR4ZKBI5T2LZ64TH2X7B54WI2W6W6PGIOZ2Z3VLUD`)

The script prints:
1. Initial request status (expected `402`).
2. Paid retry status.
3. Response body.
4. Payment settle response header if payment succeeds.
