import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { assert } from "chai";
import { BasicBank } from "../target/types/basic_bank";

describe("basic_bank", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.BasicBank as Program<BasicBank>;
  const provider = anchor.AnchorProvider.env();

  // Generate a new keypair for the bank account
  const bankAccount = Keypair.generate();

  // Use provider's wallet as the signer
  const signer = provider.wallet;

  // Test deposit amount
  const depositAmount = new anchor.BN(1_000_000_000); // 1 SOL in lamports
  const withdrawAmount = new anchor.BN(500_000_000); // 0.5 SOL in lamports

  // Find PDA for user accounts
  const [userAccountPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("user-account"), signer.publicKey.toBuffer()],
    program.programId
  );

  it("Initializes the bank account", async () => {
    // Initialize the bank account
    const tx = await program.methods
      .initialize()
      .accounts({
        bank: bankAccount.publicKey,
        payer: signer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([bankAccount])
      .rpc();

    console.log("Initialize transaction signature", tx);

    // Fetch the bank account data
    const bankData = await program.account.bank.fetch(bankAccount.publicKey);

    // Verify the bank is initialized correctly
    assert.equal(bankData.totalDeposits.toString(), "0");
  });

  it("Creates a user account", async () => {
    // Create user account for the signer
    const tx = await program.methods
      .createUserAccount()
      .accounts({
        bank: bankAccount.publicKey,
        userAccount: userAccountPDA,
        user: signer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Create user account transaction signature", tx);

    // Fetch the user account data
    const userAccountData = await program.account.userAccount.fetch(
      userAccountPDA
    );

    // Verify the user account is set correctly
    assert.equal(userAccountData.owner.toString(), signer.publicKey.toString());
    assert.equal(userAccountData.balance.toString(), "0");
  });
});
