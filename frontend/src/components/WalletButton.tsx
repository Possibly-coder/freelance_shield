"use client";

import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function WalletButton() {
  return (
    <WalletMultiButtonDynamic
      style={{
        background: "linear-gradient(135deg, #1f2fe7 0%, #4050ff 100%)",
        borderRadius: "9999px",
        fontSize: "12px",
        fontWeight: 700,
        height: "36px",
        padding: "0 16px",
      }}
    />
  );
}
