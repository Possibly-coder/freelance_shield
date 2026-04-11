import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { SolanaProvider } from "@/lib/solana";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreelanceShield - Secure Milestone Payments on Solana",
  description: "Trustless milestone-based escrow for freelancers. Payments secured on Solana blockchain. No middleman. No 20% fees.",
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
