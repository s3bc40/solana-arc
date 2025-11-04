import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day14TxOriginOwner } from "../target/types/day14_tx_origin_owner";

describe("day14-tx-origin-owner", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .day14TxOriginOwner as Program<Day14TxOriginOwner>;

  let myKeyPair = anchor.web3.Keypair.generate();

  let keypair2 = anchor.web3.Keypair.generate();
  let keypair3 = anchor.web3.Keypair.generate();

  it("Is signed by a single signer!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize()
      .accounts({
        signer1: program.provider.publicKey,
      })
      .rpc();
    console.log("Your transaction signature", tx);
    console.log("The signer1 is: ", program.provider.publicKey.toBase58());
  });

  it("Is signed by two signers!", async () => {
    const tx = await program.methods
      .initialize()
      .accounts({
        signer1: program.provider.publicKey,
        signer2: myKeyPair.publicKey,
      })
      .signers([myKeyPair])
      .rpc();

    console.log("Your transaction signature", tx);
    console.log("The signer1 is: ", program.provider.publicKey.toBase58());
    console.log("The signer2 is: ", myKeyPair.publicKey.toBase58());
  });

  it("Is signed by three signers!", async () => {
    const tx = await program.methods
      .threeSigners()
      .accounts({
        signer1: program.provider.publicKey,
        signer2: keypair2.publicKey,
        signer3: keypair3.publicKey,
      })
      .signers([keypair2, keypair3])
      .rpc();

    console.log("Your transaction signature", tx);
    console.log("The signer1 is: ", program.provider.publicKey.toBase58());
    console.log("The signer2 is: ", keypair2.publicKey.toBase58());
    console.log("The signer3 is: ", keypair3.publicKey.toBase58());
  });

  it("Called by owner!", async () => {
    const tx = await program.methods
      .onlyOwner()
      .accounts({
        signer1: program.provider.publicKey,
      })
      .rpc();
    console.log("Your transaction signature", tx);
  });

  it("Called by non-owner should fail!", async () => {
    const tx = await program.methods
      .onlyOwner()
      .accounts({
        signer1: myKeyPair.publicKey,
      })
      .signers([myKeyPair])
      .rpc();
    console.log("Your transaction signature", tx);
  });

  it("Called by owner updated account!", async () => {
    const tx = await program.methods
      .onlyOwner()
      .accounts({
        signer1: myKeyPair.publicKey,
        owner: myKeyPair.publicKey,
      })
      .signers([myKeyPair])
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
