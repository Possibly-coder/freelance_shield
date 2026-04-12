"use client";

import { useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";
import { getProgram } from "./program-client";

export function useAnchorProvider() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = useMemo(() => {
    if (!wallet.publicKey || !wallet.signTransaction) return null;
    return new AnchorProvider(
      connection,
      wallet as any,
      { commitment: "confirmed" }
    );
  }, [connection, wallet]);

  return provider;
}

export function useFreelanceShield() {
  const provider = useAnchorProvider();
  const program = useMemo(() => {
    if (!provider) return null;
    return getProgram(provider);
  }, [provider]);
  return { provider, program };
}
