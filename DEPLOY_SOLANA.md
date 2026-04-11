# Deploying FreelanceShield to Solana Devnet

## Prerequisites

Make sure these are in your PATH (add to `~/.zshrc`):

```bash
export PATH="$HOME/.cargo/bin:$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

Then restart your terminal or run `source ~/.zshrc`.

## Step 1: Build the program

```bash
cd ~/Documents/FreelanceShield
anchor build
```

This generates:
- `target/deploy/freelance_shield.so` (the compiled program)
- `target/idl/freelance_shield.json` (the IDL)
- `target/deploy/freelance_shield-keypair.json` (program keypair)

## Step 2: Switch to devnet

```bash
solana config set --url devnet
```

## Step 3: Get devnet SOL for deployment

```bash
solana airdrop 5
solana balance
```

You need ~3 SOL to deploy the program.

## Step 4: Deploy

```bash
anchor deploy --provider.cluster devnet
```

Copy the program ID from the output. It should match the one in `Anchor.toml`.

## Step 5: Update frontend environment

In Vercel (or `frontend/.env.local`):

```
NEXT_PUBLIC_PROGRAM_ID=<your-deployed-program-id>
NEXT_PUBLIC_USDC_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
```

The USDC mint above is the devnet USDC. For mainnet, use `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`.

## Step 6: Test end-to-end

1. Open the site and connect Phantom wallet (set to devnet)
2. Create a contract (sends a Solana transaction)
3. Fund a milestone with devnet USDC
4. Submit and approve
5. Verify funds transfer on Solana Explorer

## Getting Devnet USDC

Devnet USDC can be obtained from:
- https://faucet.circle.com (select Solana devnet)
- Or create a mock mint in your test

## Useful commands

```bash
# Check your program
solana program show <PROGRAM_ID>

# View program logs
solana logs <PROGRAM_ID>

# Check account data
anchor account freelance_shield.EscrowContract <PDA_ADDRESS> --provider.cluster devnet
```
