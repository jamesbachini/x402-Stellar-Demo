# Repository Guidelines

## Project Structure & Module Organization
- `server/`: Express resource server protected by x402 middleware (`index.js`, `.env.example`).
- `client/`: Node client that triggers `402` then retries with payment (`index.js`, `.env.example`).
- `x402/`: vendored upstream x402 monorepo used as workspace source for `@x402/*` packages.
- `figma/`: reference screenshots for demo UX states.
- Root workspace wiring lives in `pnpm-workspace.yaml` (includes `server`, `client`, and `x402/typescript/packages/**`).

## Build, Test, and Development Commands
- `pnpm install` (root): install all workspace dependencies.
- `pnpm --filter server start`: run protected API on `PORT` (default `3000`).
- `pnpm --filter client start`: run Stellar payer client against `RESOURCE_SERVER_URL`.
- `pnpm -C x402/typescript build`: build x402 TypeScript packages with Turbo.
- `pnpm -C x402/typescript test`: run package test suites (Vitest) in x402 TS workspace.
- Optional local facilitator flow: `pnpm --dir x402/examples/typescript/facilitator/advanced dev:all-networks`.

## Coding Style & Naming Conventions
- JavaScript/TypeScript style follows existing code: ESM modules, semicolons, and 2-space indentation.
- Use `camelCase` for variables/functions, `PascalCase` for classes, and uppercase `SCREAMING_SNAKE_CASE` for env-derived constants.
- Keep files focused: one main responsibility per `index.js`/module.
- For changes inside `x402/typescript`, use project tooling: `pnpm -C x402/typescript lint` and `pnpm -C x402/typescript format`.

## Testing Guidelines
- Root demo (`client/`, `server/`) currently has no dedicated automated test suite; validate by running server/client end-to-end.
- For `x402/typescript` edits, add/update Vitest tests (`*.test.ts`) near the changed package and run `pnpm -C x402/typescript test`.
- No repository-wide coverage threshold is defined; do not merge behavior changes without at least one reproducible verification path.

## Commit & Pull Request Guidelines
- Current history uses short, imperative, plain-language subjects (examples: `Add Readme`, `Remove paywall`, `tidy up`).
- Prefer concise commit titles under ~60 chars; expand reasoning in the body when needed.
- PRs should include: what changed, why, test evidence (command + result), and any `.env`/network assumptions.
- If your PR modifies vendored `x402`, follow `x402/CONTRIBUTING.md` expectations (including signed commits for upstream contributions).

## Security & Configuration Tips
- Copy `.env.example` files; never commit real secrets.
- Keep `NETWORK` aligned across client/server (`stellar:testnet` or `stellar:pubnet`) to avoid false payment failures.
