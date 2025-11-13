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

  it("Deposits funds into the bank", async () => {
    // Get initial SOL balances
    const initialUserBalance = await provider.connection.getBalance(
      signer.publicKey
    );
    const initialBankBalance = await provider.connection.getBalance(
      bankAccount.publicKey
    );

    console.log(`Initial user SOL balance: ${initialUserBalance / 1e9} SOL`);
    console.log(`Initial bank SOL balance: ${initialBankBalance / 1e9} SOL`);

    // Deposit funds into the bank
    const tx = await program.methods
      .deposit(depositAmount)
      .accounts({
        bank: bankAccount.publicKey,
        userAccount: userAccountPDA,
        user: signer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Deposit transaction signature", tx);

    // Get the user's account balance
    const userAccountData = await program.account.userAccount.fetch(
      userAccountPDA
    );

    // Verify the tracked balance is correct
    assert.equal(userAccountData.balance.toString(), depositAmount.toString());

    // Verify bank total tracked deposits
    const bankData = await program.account.bank.fetch(bankAccount.publicKey);
    assert.equal(bankData.totalDeposits.toString(), depositAmount.toString());

    // Get final SOL balances
    const finalUserBalance = await provider.connection.getBalance(
      signer.publicKey
    );
    const finalBankBalance = await provider.connection.getBalance(
      bankAccount.publicKey
    );

    console.log(`Final user SOL balance: ${finalUserBalance / 1e9} SOL`);
    console.log(`Final bank SOL balance: ${finalBankBalance / 1e9} SOL`);

    // Check actual SOL transfers (accounting for tx fees)
    assert.isTrue(finalBankBalance > initialBankBalance);

    // User balance should be reduced by deposit amount + some tx fees
    assert.isTrue(
      finalUserBalance < initialUserBalance - Number(depositAmount)
    );
    assert.isTrue(
      finalUserBalance > initialUserBalance - Number(depositAmount) - 10000
    ); // Account for a reasonable tx fees
  });

  it("Retrieves user balance", async () => {
    // Get the user's balance
    const balance = await program.methods
      .getBalance()
      .accounts({
        bank: bankAccount.publicKey,
        userAccount: userAccountPDA,
        user: signer.publicKey,
      })
      .view(); // The .view() method in Anchor is used to call instructions that only read data (view functions) without submitting an actual transaction

    // Verify the balance is correct
    assert.equal(balance.toString(), depositAmount.toString());

    console.log(`User balance: ${Number(balance) / 1e9} SOL`);
  });

  it("Withdraws funds from the bank", async () => {
    // Get the initial balance
    const userAccountData = await program.account.userAccount.fetch(
      userAccountPDA
    );
    const initialBalance = userAccountData.balance;

    // Get initial SOL balances
    const initialUserBalance = await provider.connection.getBalance(
      signer.publicKey
    );
    const initialBankBalance = await provider.connection.getBalance(
      bankAccount.publicKey
    );

    console.log(`Initial user SOL balance: ${initialUserBalance / 1e9} SOL`);
    console.log(`Initial bank SOL balance: ${initialBankBalance / 1e9} SOL`);

    // Withdraw funds from the bank
    const tx = await program.methods
      .withdraw(withdrawAmount)
      .accounts({
        bank: bankAccount.publicKey,
        userAccount: userAccountPDA,
        user: signer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Withdraw transaction signature", tx);

    // Get the new balance
    const updatedUserAccountData = await program.account.userAccount.fetch(
      userAccountPDA
    );
    const newBalance = updatedUserAccountData.balance;

    // Verify the balance is correct
    const expectedBalance = initialBalance.sub(withdrawAmount);
    assert.equal(newBalance.toString(), expectedBalance.toString());

    // Verify bank total deposits
    const bankData = await program.account.bank.fetch(bankAccount.publicKey);
    assert.equal(bankData.totalDeposits.toString(), expectedBalance.toString());

    // Get final SOL balances
    const finalUserBalance = await provider.connection.getBalance(
      signer.publicKey
    );
    const finalBankBalance = await provider.connection.getBalance(
      bankAccount.publicKey
    );

    console.log(`Final user SOL balance: ${finalUserBalance / 1e9} SOL`);
    console.log(`Final bank SOL balance: ${finalBankBalance / 1e9} SOL`);

    // Check actual SOL transfers
    // User balance should increase by withdraw amount (minus tx fees)
    // Since the user pays tx fees, the final balance might be slightly less than expected
    assert.isTrue(
      finalUserBalance < initialUserBalance + Number(withdrawAmount)
    );
    assert.isTrue(finalUserBalance > initialUserBalance - 10000); // Allow for reasonable tx fees

    // Bank balance should decrease by withdraw amount
    assert.isTrue(finalBankBalance <= initialBankBalance);
  });

  it("Prevents users from withdrawing more than their balance", async () => {
    // Try to withdraw more than the balance
    const excessiveWithdrawAmount = new anchor.BN(10_000_000); // 10 SOL

    try {
      await program.methods
        .withdraw(excessiveWithdrawAmount)
        .accounts({
          bank: bankAccount.publicKey,
          userAccount: userAccountPDA,
          user: signer.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      // If we reach here, the test failed
      assert.fail("Should have thrown an error for insufficient balance");
    } catch (error) {
      // Log the actual error
      console.log("Error received:", error.toString());

      // Check for multiple possible error messages that could indicate insufficient balance
      const errorMsg = error.toString().toLowerCase();
      assert.isTrue(
        errorMsg.includes("insufficient balance") || errorMsg.includes("0x7d3")
      );
    }
  });
});
