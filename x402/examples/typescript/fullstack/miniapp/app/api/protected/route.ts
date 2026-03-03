import { NextRequest, NextResponse } from "next/server";
import { withX402FromHTTPServer } from "@x402/next";
import {
  x402ResourceServer,
  x402HTTPResourceServer,
  HTTPFacilitatorClient,
} from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";

const DEFAULT_FACILITATOR_URL = "https://x402.org/facilitator";
const facilitatorUrl = process.env.FACILITATOR_URL || DEFAULT_FACILITATOR_URL;

if (!process.env.FACILITATOR_URL) {
  console.warn(
    `FACILITATOR_URL not set. Falling back to default facilitator: ${DEFAULT_FACILITATOR_URL}`,
  );
}

const getEvmAddress = (): `0x${string}` => process.env.EVM_ADDRESS as `0x${string}`;
const createRuntimeConfigError = () =>
  !process.env.EVM_ADDRESS
    ? "Missing required environment variable: EVM_ADDRESS. Set it in .env before requesting this route."
    : null;

// Create HTTP facilitator client
const facilitatorClient = new HTTPFacilitatorClient({ url: facilitatorUrl });

// Create x402 resource server
const server = new x402ResourceServer(facilitatorClient);
server.register("eip155:*", new ExactEvmScheme());

/**
 * Protected API endpoint handler
 *
 * This handler returns data after payment verification.
 * Payment is only settled after a successful response (status < 400).
 *
 * @param _ - Incoming Next.js request
 * @returns JSON response with protected data
 */
const handler = async (_: NextRequest) => {
  console.log("Protected route accessed successfully");

  return NextResponse.json(
    {
      success: true,
      message: "Protected action completed successfully",
      timestamp: new Date().toISOString(),
      data: {
        secretMessage: "This content was paid for with x402!",
        accessedAt: Date.now(),
      },
    },
    { status: 200 },
  );
};

/**
 * Protected API endpoint using withX402 wrapper
 *
 * This demonstrates the v2 withX402 wrapper for individual API routes.
 * Unlike middleware, withX402 guarantees payment settlement only after
 * the handler returns a successful response (status < 400).
 */
const httpServer = new x402HTTPResourceServer(server, {
  "*": {
    accepts: [
      {
        scheme: "exact",
        price: "$0.01",
        network: "eip155:84532", // base-sepolia
        payTo: () => getEvmAddress(),
      },
    ],
    description: "Access to protected Mini App API",
    mimeType: "application/json",
  },
});

httpServer.onProtectedRequest(async () => {
  const runtimeConfigError = createRuntimeConfigError();
  if (runtimeConfigError) {
    return { abort: true, reason: runtimeConfigError };
  }
});

export const GET = withX402FromHTTPServer(handler, httpServer);
