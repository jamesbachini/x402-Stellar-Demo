"use client";

import dynamic from "next/dynamic";

const PaywallClient = dynamic(() => import("./paywall-client"), {
  ssr: false,
});

export default function PaywallPage() {
  return <PaywallClient />;
}
