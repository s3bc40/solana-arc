import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day25PdaKeypairAcc } from "../target/types/day25_pda_keypair_acc";

async function airdropSol(publicKey, amount) {
  let airdropTx = await anchor
    .getProvider()
    .connection.requestAirdrop(
      publicKey,
      amount * anchor.web3.LAMPORTS_PER_SOL
    );
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

describe("day25-pda-keypair-acc", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .Day25PdaKeypairAcc as Program<Day25PdaKeypairAcc>;

  it("Is initialized -- PDA version", async () => {
    const seeds = [];
    const [myPda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );

    console.log("the storage account address is", myPda.toBase58());

    const tx = await program.methods
      .initializePda()
      .accounts({ myPda: myPda })
      .rpc();
  });

  it("Is initialized -- keypair version", async () => {
    const newKeypair = anchor.web3.Keypair.generate();
    const secondKeypair = anchor.web3.Keypair.generate();
    await airdropSol(newKeypair.publicKey, 1);

    console.log(
      "the keypair account address is",
      newKeypair.publicKey.toBase58()
    );

    // Exercise: PDA test that fails
    const seeds = [];
    const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );

    await program.methods
      .initializeKeypairAccount()
      .accounts({ myKeypairAccount: newKeypair.publicKey }) // this works
      // .accounts({ myKeypairAccount: secondKeypair.publicKey }) // should fail
      // .accounts({ myKeypairAccount: pda })
      .signers([newKeypair]) // the signer must be the keypair
      .rpc();
  });

  it("Writing to keypair account fails", async () => {
    const newKeypair = anchor.web3.Keypair.generate();
    const recieverWallet = anchor.web3.Keypair.generate();

    // Airdrop some SOL to the new keypair
    await airdropSol(newKeypair.publicKey, 10);

    // Try to send some SOL from the new keypair to another wallet
    let tx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.transfer({
        fromPubkey: newKeypair.publicKey,
        toPubkey: recieverWallet.publicKey,
        lamports: 1 * anchor.web3.LAMPORTS_PER_SOL,
      })
    );

    await anchor.web3.sendAndConfirmTransaction(
      anchor.getProvider().connection,
      tx,
      [newKeypair]
    );
    console.log("sent 1 lamport");

    // initialize the keypair account
    await program.methods
      .initializeKeypairAccount()
      .accounts({
        myKeypairAccount: newKeypair.publicKey,
      })
      .signers([newKeypair])
      .rpc();
    console.log("initialized keypair account");

    // Try to send some SOL again, should fail now
    tx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.transfer({
        fromPubkey: newKeypair.publicKey,
        toPubkey: recieverWallet.publicKey,
        lamports: 1 * anchor.web3.LAMPORTS_PER_SOL,
      })
    );
    await anchor.web3
      .sendAndConfirmTransaction(anchor.getProvider().connection, tx, [
        newKeypair,
      ])
      .catch((err) => {
        console.log(
          "expected failure when sending from keypair account:",
          err.message
        );
      });
  });

  it("Console log account owner", async () => {
    console.log(`The program address is ${program.programId}`);
    const newKeypair = anchor.web3.Keypair.generate();
    var recieverWallet = anchor.web3.Keypair.generate();

    // get account owner before initialization
    await airdropSol(newKeypair.publicKey, 10);
    const accountInfoBefore = await anchor
      .getProvider()
      .connection.getAccountInfo(newKeypair.publicKey);
    console.log(`initial keypair account owner is ${accountInfoBefore.owner}`);

    await program.methods
      .initializeKeypairAccount()
      .accounts({ myKeypairAccount: newKeypair.publicKey })
      .signers([newKeypair]) // the signer must be the keypair
      .rpc();

    // get account owner after initialization

    const accountInfoAfter = await anchor
      .getProvider()
      .connection.getAccountInfo(newKeypair.publicKey);
    console.log(`initial keypair account owner is ${accountInfoAfter.owner}`);
  });
});
