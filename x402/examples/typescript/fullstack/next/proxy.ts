import { paymentProxyFromHTTPServer } from "@x402/next";
import {
  x402ResourceServer,
  x402HTTPResourceServer,
  HTTPFacilitatorClient,
  type RoutesConfig,
} from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { ExactSvmScheme } from "@x402/svm/exact/server";
import { createPaywall } from "@x402/paywall";
import { evmPaywall } from "@x402/paywall/evm";
import { svmPaywall } from "@x402/paywall/svm";
import { declareDiscoveryExtension } from "@x402/extensions/bazaar";

const DEFAULT_FACILITATOR_URL = "https://x402.org/facilitator";
const REQUIRED_ENV_VARS = ["EVM_ADDRESS", "SVM_ADDRESS"] as const;

const facilitatorUrl = process.env.FACILITATOR_URL || DEFAULT_FACILITATOR_URL;

if (!process.env.FACILITATOR_URL) {
  console.warn(
    `FACILITATOR_URL not set. Falling back to default facilitator: ${DEFAULT_FACILITATOR_URL}`,
  );
}

export const getEvmAddress = (): `0x${string}` => process.env.EVM_ADDRESS as `0x${string}`;
export const getSvmAddress = (): string => process.env.SVM_ADDRESS as string;

const getMissingRequiredEnvVars = () => REQUIRED_ENV_VARS.filter(envVar => !process.env[envVar]);

const createRuntimeConfigError = () => {
  const missingEnvVars = getMissingRequiredEnvVars();
  if (missingEnvVars.length === 0) {
    return null;
  }
  return `Missing required environment variable(s): ${missingEnvVars.join(", ")}. Set them in .env before requesting protected routes.`;
};

// Create HTTP facilitator client
const facilitatorClient = new HTTPFacilitatorClient({ url: facilitatorUrl });

// Create x402 resource server
export const server = new x402ResourceServer(facilitatorClient);

// Register schemes
server.register("eip155:*", new ExactEvmScheme());
server.register("solana:*", new ExactSvmScheme());

// Build paywall
export const paywall = createPaywall()
  .withNetwork(evmPaywall)
  .withNetwork(svmPaywall)
  .withConfig({
    appName: process.env.APP_NAME || "Next x402 Demo",
    appLogo: process.env.APP_LOGO || "/x402-icon-blue.png",
    testnet: true,
  })
  .build();

export const createGuardedHTTPServer = (routes: RoutesConfig) => {
  const httpServer = new x402HTTPResourceServer(server, routes);
  httpServer.onProtectedRequest(async () => {
    const runtimeConfigError = createRuntimeConfigError();
    if (runtimeConfigError) {
      return { abort: true, reason: runtimeConfigError };
    }
  });
  return httpServer;
};

const proxyHTTPServer = createGuardedHTTPServer({
  "/protected": {
    accepts: [
      {
        scheme: "exact",
        price: "$0.001",
        network: "eip155:84532", // base-sepolia
        payTo: () => getEvmAddress(),
      },
      {
        scheme: "exact",
        price: "$0.001",
        network: "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1", // solana devnet
        payTo: () => getSvmAddress(),
      },
    ],
    description: "Premium music: x402 Remix",
    mimeType: "text/html",
    extensions: {
      ...declareDiscoveryExtension({}),
    },
  },
});

// Build proxy
export const proxy = paymentProxyFromHTTPServer(
  proxyHTTPServer,
  undefined, // paywallConfig (using custom paywall instead)
  paywall, // custom paywall provider
);

// Configure which paths the proxy should run on
export const config = {
  matcher: ["/protected/:path*"],
};
