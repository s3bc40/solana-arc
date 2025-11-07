import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day24EditAccDiffSigners } from "../target/types/day24_edit_acc_diff_signers";

async function airdropSol(publicKey, amount) {
  let airdropTx = await anchor
    .getProvider()
    .connection.requestAirdrop(publicKey, amount);
  await confirmTransaction(airdropTx);
}

async function confirmTransaction(tx) {
  const latestBlockHash = await anchor
    .getProvider()
    .connection.getLatestBlockhash();

  await anchor.getProvider().connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: tx,
  });
}

describe("day24-edit-acc-diff-signers", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .day24EditAccDiffSigners as Program<Day24EditAccDiffSigners>;

  it("Is initialized!", async () => {
    const alice = anchor.web3.Keypair.generate();
    const bob = anchor.web3.Keypair.generate();

    // Airdrop some SOL to Alice and Bob
    await airdropSol(alice.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL); // 1 SOL
    await airdropSol(bob.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL); // 1 SOL

    let seeds = [];
    const [myStorage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );

    // Alice is paying for the initialization
    await program.methods
      .initialize()
      .accounts({
        myStorage,
        fren: alice.publicKey, // EXPLICITLY using different signer
      })
      .signers([alice])
      .rpc();

    // Now Bob will update the value
    await program.methods
      .updateValue(new anchor.BN(42))
      .accounts({
        myStorage,
        fren: bob.publicKey, // EXPLICITLY using different signer
      })
      .signers([bob])
      .rpc();

    let value = await program.account.myStorage.fetch(myStorage);
    console.log(`value stored is ${value.x}`);
  });
});
