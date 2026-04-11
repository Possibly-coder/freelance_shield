import { Program, AnchorProvider, BN, web3 } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import idl from "./idl.json";
import { PROGRAM_ID, USDC_MINT, getContractPda, getMilestonePda, getVaultPda, getTrustScorePda } from "./solana";

export function getProgram(provider: AnchorProvider) {
  return new Program(idl as any, provider);
}

export async function createContractOnChain(
  provider: AnchorProvider,
  contractId: number,
  autoReleaseHours: number,
  milestoneAmounts: number[],
) {
  const program = getProgram(provider);
  const client = provider.wallet.publicKey;
  const contractPda = getContractPda(client, contractId);

  const milestones = milestoneAmounts.map((amount) => ({
    amount: new BN(amount),
  }));

  await program.methods
    .createContract(new BN(contractId), new BN(autoReleaseHours), milestones)
    .accounts({
      client,
      contract: contractPda,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  for (let i = 0; i < milestoneAmounts.length; i++) {
    const milestonePda = getMilestonePda(contractPda, i);
    const vaultPda = getVaultPda(milestonePda);

    await program.methods
      .initMilestone(i, new BN(milestoneAmounts[i]))
      .accounts({
        client,
        contract: contractPda,
        milestone: milestonePda,
        usdcMint: USDC_MINT,
        vault: vaultPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }

  return contractPda;
}

export async function acceptContractOnChain(
  provider: AnchorProvider,
  contractPda: PublicKey,
) {
  const program = getProgram(provider);

  await program.methods
    .acceptContract()
    .accounts({
      freelancer: provider.wallet.publicKey,
      contract: contractPda,
    })
    .rpc();
}

export async function fundMilestoneOnChain(
  provider: AnchorProvider,
  contractPda: PublicKey,
  milestoneIndex: number,
) {
  const program = getProgram(provider);
  const client = provider.wallet.publicKey;
  const milestonePda = getMilestonePda(contractPda, milestoneIndex);
  const vaultPda = getVaultPda(milestonePda);
  const clientTokenAccount = await getAssociatedTokenAddress(USDC_MINT, client);

  await program.methods
    .fundMilestone()
    .accounts({
      client,
      contract: contractPda,
      milestone: milestonePda,
      clientTokenAccount,
      vault: vaultPda,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();
}

export async function submitMilestoneOnChain(
  provider: AnchorProvider,
  contractPda: PublicKey,
  milestoneIndex: number,
) {
  const program = getProgram(provider);
  const milestonePda = getMilestonePda(contractPda, milestoneIndex);

  await program.methods
    .submitMilestone()
    .accounts({
      freelancer: provider.wallet.publicKey,
      contract: contractPda,
      milestone: milestonePda,
    })
    .rpc();
}

export async function approveMilestoneOnChain(
  provider: AnchorProvider,
  contractPda: PublicKey,
  milestoneIndex: number,
) {
  const program = getProgram(provider);
  const milestonePda = getMilestonePda(contractPda, milestoneIndex);

  await program.methods
    .approveMilestone()
    .accounts({
      client: provider.wallet.publicKey,
      contract: contractPda,
      milestone: milestonePda,
    })
    .rpc();
}

export async function releaseMilestoneOnChain(
  provider: AnchorProvider,
  contractPda: PublicKey,
  milestoneIndex: number,
  freelancerPubkey: PublicKey,
) {
  const program = getProgram(provider);
  const milestonePda = getMilestonePda(contractPda, milestoneIndex);
  const vaultPda = getVaultPda(milestonePda);
  const freelancerTokenAccount = await getAssociatedTokenAddress(USDC_MINT, freelancerPubkey);

  await program.methods
    .releaseMilestone()
    .accounts({
      client: provider.wallet.publicKey,
      contract: contractPda,
      milestone: milestonePda,
      vault: vaultPda,
      freelancerTokenAccount,
      vaultAuthority: vaultPda,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();
}

export async function autoReleaseOnChain(
  provider: AnchorProvider,
  contractPda: PublicKey,
  milestoneIndex: number,
  freelancerPubkey: PublicKey,
) {
  const program = getProgram(provider);
  const milestonePda = getMilestonePda(contractPda, milestoneIndex);
  const vaultPda = getVaultPda(milestonePda);
  const freelancerTokenAccount = await getAssociatedTokenAddress(USDC_MINT, freelancerPubkey);

  await program.methods
    .autoRelease()
    .accounts({
      cranker: provider.wallet.publicKey,
      contract: contractPda,
      milestone: milestonePda,
      vault: vaultPda,
      freelancerTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();
}

export async function raiseDisputeOnChain(
  provider: AnchorProvider,
  contractPda: PublicKey,
  milestoneIndex: number,
) {
  const program = getProgram(provider);
  const milestonePda = getMilestonePda(contractPda, milestoneIndex);

  await program.methods
    .raiseDispute()
    .accounts({
      raiser: provider.wallet.publicKey,
      contract: contractPda,
      milestone: milestonePda,
    })
    .rpc();
}

export async function initTrustScoreOnChain(provider: AnchorProvider) {
  const program = getProgram(provider);
  const user = provider.wallet.publicKey;
  const trustPda = getTrustScorePda(user);

  await program.methods
    .initTrustScore()
    .accounts({
      user,
      trustScore: trustPda,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
}

export async function fetchContractOnChain(provider: AnchorProvider, contractPda: PublicKey) {
  const program = getProgram(provider);
  return await (program.account as any).escrowContract.fetch(contractPda);
}

export async function fetchMilestoneOnChain(provider: AnchorProvider, milestonePda: PublicKey) {
  const program = getProgram(provider);
  return await (program.account as any).milestone.fetch(milestonePda);
}

export async function fetchTrustScoreOnChain(provider: AnchorProvider, userPubkey: PublicKey) {
  const program = getProgram(provider);
  const trustPda = getTrustScorePda(userPubkey);
  try {
    return await (program.account as any).trustScore.fetch(trustPda);
  } catch {
    return null;
  }
}
