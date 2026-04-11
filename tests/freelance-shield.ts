import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { FreelanceShield } from "../target/types/freelance_shield";
import {
  createMint,
  createAccount,
  mintTo,
  getAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { assert } from "chai";

describe("freelance-shield", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.FreelanceShield as Program<FreelanceShield>;

  const client = anchor.web3.Keypair.generate();
  const freelancer = anchor.web3.Keypair.generate();
  let usdcMint: anchor.web3.PublicKey;
  let clientTokenAccount: anchor.web3.PublicKey;
  let freelancerTokenAccount: anchor.web3.PublicKey;
  const contractId = new anchor.BN(1);

  let contractPda: anchor.web3.PublicKey;
  let milestonePda: anchor.web3.PublicKey;
  let vaultPda: anchor.web3.PublicKey;

  before(async () => {
    // Airdrop SOL to client and freelancer
    const airdropClient = await provider.connection.requestAirdrop(
      client.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropClient);

    const airdropFreelancer = await provider.connection.requestAirdrop(
      freelancer.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropFreelancer);

    // Create USDC mock mint
    usdcMint = await createMint(
      provider.connection,
      client,
      client.publicKey,
      null,
      6 // USDC has 6 decimals
    );

    // Create token accounts
    clientTokenAccount = await createAccount(
      provider.connection,
      client,
      usdcMint,
      client.publicKey
    );

    freelancerTokenAccount = await createAccount(
      provider.connection,
      freelancer,
      usdcMint,
      freelancer.publicKey
    );

    // Mint 10,000 USDC to client
    await mintTo(
      provider.connection,
      client,
      usdcMint,
      clientTokenAccount,
      client,
      10_000_000_000 // 10,000 USDC (6 decimals)
    );

    // Derive PDAs
    [contractPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("contract"),
        client.publicKey.toBuffer(),
        contractId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    [milestonePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("milestone"), contractPda.toBuffer(), Buffer.from([0])],
      program.programId
    );

    [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), milestonePda.toBuffer()],
      program.programId
    );
  });

  it("Creates a contract", async () => {
    await program.methods
      .createContract(contractId, new anchor.BN(48), [{ amount: new anchor.BN(5_000_000) }])
      .accounts({
        client: client.publicKey,
        contract: contractPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([client])
      .rpc();

    const contract = await program.account.escrowContract.fetch(contractPda);
    assert.equal(contract.client.toBase58(), client.publicKey.toBase58());
    assert.equal(contract.milestoneCount, 1);
    assert.equal(contract.totalAmount.toNumber(), 5_000_000);
    assert.equal(contract.autoReleaseHours.toNumber(), 48);
  });

  it("Initializes a milestone with vault", async () => {
    await program.methods
      .initMilestone(0, new anchor.BN(5_000_000))
      .accounts({
        client: client.publicKey,
        contract: contractPda,
        milestone: milestonePda,
        usdcMint: usdcMint,
        vault: vaultPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([client])
      .rpc();

    const milestone = await program.account.milestone.fetch(milestonePda);
    assert.equal(milestone.amount.toNumber(), 5_000_000);
    assert.deepEqual(milestone.status, { pending: {} });
  });

  it("Freelancer accepts the contract", async () => {
    await program.methods
      .acceptContract()
      .accounts({
        freelancer: freelancer.publicKey,
        contract: contractPda,
      })
      .signers([freelancer])
      .rpc();

    const contract = await program.account.escrowContract.fetch(contractPda);
    assert.equal(contract.freelancer.toBase58(), freelancer.publicKey.toBase58());
    assert.deepEqual(contract.status, { active: {} });
  });

  it("Client funds the milestone", async () => {
    await program.methods
      .fundMilestone()
      .accounts({
        client: client.publicKey,
        contract: contractPda,
        milestone: milestonePda,
        clientTokenAccount: clientTokenAccount,
        vault: vaultPda,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([client])
      .rpc();

    const milestone = await program.account.milestone.fetch(milestonePda);
    assert.deepEqual(milestone.status, { funded: {} });

    const vaultAccount = await getAccount(provider.connection, vaultPda);
    assert.equal(Number(vaultAccount.amount), 5_000_000);
  });

  it("Freelancer submits milestone", async () => {
    await program.methods
      .submitMilestone()
      .accounts({
        freelancer: freelancer.publicKey,
        contract: contractPda,
        milestone: milestonePda,
      })
      .signers([freelancer])
      .rpc();

    const milestone = await program.account.milestone.fetch(milestonePda);
    assert.deepEqual(milestone.status, { submitted: {} });
    assert.ok(milestone.autoReleaseAt.toNumber() > 0);
  });

  it("Client approves milestone", async () => {
    await program.methods
      .approveMilestone()
      .accounts({
        client: client.publicKey,
        contract: contractPda,
        milestone: milestonePda,
      })
      .signers([client])
      .rpc();

    const milestone = await program.account.milestone.fetch(milestonePda);
    assert.deepEqual(milestone.status, { approved: {} });
  });

  it("Client releases funds to freelancer", async () => {
    const beforeBalance = await getAccount(provider.connection, freelancerTokenAccount);

    await program.methods
      .releaseMilestone()
      .accounts({
        client: client.publicKey,
        contract: contractPda,
        milestone: milestonePda,
        vault: vaultPda,
        freelancerTokenAccount: freelancerTokenAccount,
        vaultAuthority: vaultPda,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([client])
      .rpc();

    const milestone = await program.account.milestone.fetch(milestonePda);
    assert.deepEqual(milestone.status, { released: {} });

    const afterBalance = await getAccount(provider.connection, freelancerTokenAccount);
    assert.equal(
      Number(afterBalance.amount) - Number(beforeBalance.amount),
      5_000_000
    );
  });

  it("Initializes trust scores", async () => {
    const [clientTrustPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("trust"), client.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .initTrustScore()
      .accounts({
        user: client.publicKey,
        trustScore: clientTrustPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([client])
      .rpc();

    const ts = await program.account.trustScore.fetch(clientTrustPda);
    assert.equal(ts.user.toBase58(), client.publicKey.toBase58());
    assert.equal(ts.contractsCompleted, 0);
  });
});
