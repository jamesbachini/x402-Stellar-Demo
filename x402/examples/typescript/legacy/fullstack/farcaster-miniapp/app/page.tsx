"use client";

import dynamic from "next/dynamic";

const MiniAppPage = dynamic(() => import("./page-client"), {
  ssr: false,
});

export default function Page() {
  return <MiniAppPage />;
}
