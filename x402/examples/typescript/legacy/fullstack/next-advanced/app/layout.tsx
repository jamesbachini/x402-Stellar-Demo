import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "x402 on Stellar Demo",
  description: "HTTP-native payments on Stellar with x402 and Soroban.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
