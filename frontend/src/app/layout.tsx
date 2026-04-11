import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { SolanaProvider } from "@/lib/solana";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreelanceShield - Trust Infrastructure for the Service Economy",
  description: "Programmable escrow on Solana. USDC locked until milestones are delivered. Permissionless auto-release. Portable on-chain trust scores.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <SolanaProvider>
          <AuthProvider>{children}</AuthProvider>
        </SolanaProvider>
      </body>
    </html>
  );
}
