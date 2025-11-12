import * as anchor from "@coral-xyz/anchor";
import * as splToken from "@solana/spl-token";
import * as web3 from "@solana/web3.js";
import { assert } from "chai";

describe("TypeScript SPL Token Tests", () => {
  const provider = anchor.AnchorProvider.env();
  const signerKp = provider.wallet.payer;
  const toKp = new web3.Keypair();

  // Define mint parameters
  const mintDecimals = 6;
  const mintAuthority = provider.wallet.publicKey;
  const freezeAuthority = provider.wallet.publicKey;

  it("Creates a mint account and ATA using TypeScript", async () => {
    // Create the Mint
    const mintPublicKey = await splToken.createMint(
      provider.connection,
      signerKp,
      mintAuthority,
      freezeAuthority,
      mintDecimals
    );

    console.log("Created Mint:", mintPublicKey.toString());

    // Create ATA for the signer
    const ataAddress = await splToken.createAssociatedTokenAccount(
      provider.connection,
      signerKp,
      mintPublicKey,
      signerKp.publicKey
    );

    console.log("Created ATA:", ataAddress.toString());

    // Mint some tokens
    const mintAmount = BigInt(1000 * 10 ** mintDecimals); // 1000 tokens
    await splToken.mintTo(
      provider.connection,
      signerKp,
      mintPublicKey,
      ataAddress,
      mintAuthority,
      mintAmount
    );

    // Verify the mint
    const mintInfo = await splToken.getMint(provider.connection, mintPublicKey);
    assert.equal(mintInfo.decimals, mintDecimals, "Mint decimals should match");
    assert.equal(
      mintInfo.mintAuthority?.toString(),
      mintAuthority.toString(),
      "Mint authority should match"
    );
    assert.equal(
      mintInfo.freezeAuthority?.toString(),
      freezeAuthority.toString(),
      "Freeze authority should match"
    );

    // Verify the balance
    const accountInfo = await splToken.getAccount(
      provider.connection,
      ataAddress
    );
    assert.equal(
      accountInfo.amount.toString(),
      mintAmount.toString(),
      "Balance should match minted amount"
    );
  });

  it("Reads token balance using TypeScript", async () => {
    // Create a new mint for this test
    const mintPublicKey = await splToken.createMint(
      provider.connection,
      signerKp,
      mintAuthority,
      freezeAuthority,
      mintDecimals
    );

    // Create ATA
    const ataAddress = await splToken.createAssociatedTokenAccount(
      provider.connection,
      signerKp,
      mintPublicKey,
      signerKp.publicKey
    );

    // Mint tokens
    const mintAmount = BigInt(1000 * 10 ** mintDecimals); // 1000 tokens
    await splToken.mintTo(
      provider.connection,
      signerKp,
      mintPublicKey,
      ataAddress,
      mintAuthority,
      mintAmount
    );

    // Read balance using getAccount
    const accountInfo = await splToken.getAccount(
      provider.connection,
      ataAddress
    );
    console.log("Token Balance:", accountInfo.amount.toString());
    assert.equal(
      accountInfo.amount.toString(),
      mintAmount.toString(),
      "Balance should match minted amount"
    );

    // Alternative: Read balance using getTokenAccountBalance
    const balance = await provider.connection.getTokenAccountBalance(
      ataAddress
    );
    assert.equal(
      balance.value.amount,
      mintAmount.toString(),
      "Balance should match minted amount"
    );
  });

  it("Transfers tokens using TypeScript", async () => {
    // Create a new mint
    const mintPublicKey = await splToken.createMint(
      provider.connection,
      signerKp,
      mintAuthority,
      freezeAuthority,
      mintDecimals
    );

    // Create source ATA
    const sourceAta = await splToken.createAssociatedTokenAccount(
      provider.connection,
      signerKp,
      mintPublicKey,
      signerKp.publicKey
    );

    // Create destination ATA
    const destinationAta = await splToken.createAssociatedTokenAccount(
      provider.connection,
      signerKp,
      mintPublicKey,
      toKp.publicKey
    );

    // Mint tokens to source
    const mintAmount = BigInt(1000 * 10 ** mintDecimals); // 1000 tokens
    await splToken.mintTo(
      provider.connection,
      signerKp,
      mintPublicKey,
      sourceAta,
      mintAuthority,
      mintAmount
    );

    // Read balance before transfer
    const sourceBalanceBefore =
      await provider.connection.getTokenAccountBalance(sourceAta);
    const destinationBalanceBefore =
      await provider.connection.getTokenAccountBalance(destinationAta);

    console.log(
      "Source Balance before transfer:",
      sourceBalanceBefore.value.amount
    );
    console.log(
      "Destination Balance before transfer:",
      destinationBalanceBefore.value.amount
    );

    // Transfer tokens
    const transferAmount = BigInt(500 * 10 ** mintDecimals); // 500 tokens
    await splToken.transfer(
      provider.connection,
      signerKp,
      sourceAta,
      destinationAta,
      signerKp.publicKey,
      transferAmount
    );

    // Read balance after transfer
    const sourceBalanceAfter = await provider.connection.getTokenAccountBalance(
      sourceAta
    );
    const destinationBalanceAfter =
      await provider.connection.getTokenAccountBalance(destinationAta);

    console.log(
      "Source Balance after transfer:",
      sourceBalanceAfter.value.amount
    );
    console.log(
      "Destination Balance after transfer:",
      destinationBalanceAfter.value.amount
    );
    assert.equal(
      sourceBalanceAfter.value.amount,
      (mintAmount - transferAmount).toString(),
      "Source should have 500 tokens left"
    );
    assert.equal(
      destinationBalanceAfter.value.amount,
      transferAmount.toString(),
      "Destination should have received 500 tokens"
    );
  });
});
