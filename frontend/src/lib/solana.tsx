"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

const NETWORK = "devnet";
const ENDPOINT = clusterApiUrl(NETWORK);

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || "eUdRS4cqv3emMFX7Ymhg4NDNWKkPQZLyzB8uVki1C27"
);

export const USDC_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_USDC_MINT || "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU" // devnet USDC
);

export function SolanaProvider({ children }: { children: ReactNode }) {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export function getContractPda(client: PublicKey, contractId: number): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("contract"),
      client.toBuffer(),
      Buffer.from(new BigUint64Array([BigInt(contractId)]).buffer),
    ],
    PROGRAM_ID
  );
  return pda;
}

export function getMilestonePda(contractPda: PublicKey, index: number): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("milestone"), contractPda.toBuffer(), Buffer.from([index])],
    PROGRAM_ID
  );
  return pda;
}

export function getVaultPda(milestonePda: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), milestonePda.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

export function getTrustScorePda(user: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("trust"), user.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

export { useConnection, useWallet };
