import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day26AccountOwnershipSol } from "../target/types/day26_account_ownership_sol";

async function airdropSol(pubKey, amount) {
  let airdropTx = await anchor
    .getProvider()
    .connection.requestAirdrop(pubKey, amount * anchor.web3.LAMPORTS_PER_SOL);

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

describe("day26-account-ownership-sol", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .day26AccountOwnershipSol as Program<Day26AccountOwnershipSol>;

  it("Is initialized!", async () => {
    console.log("program address", program.programId.toBase58());
    const seeds = [];
    const [pda, bump_] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );

    console.log(
      "owner of pda before initialize:",
      await anchor.getProvider().connection.getAccountInfo(pda)
    );

    await program.methods.initializePda().accounts({ pda: pda }).rpc();

    console.log(
      "owner of pda after initialize:",
      (
        await anchor.getProvider().connection.getAccountInfo(pda)
      ).owner.toBase58()
    );

    let keypair = anchor.web3.Keypair.generate();

    console.log(
      "owner of keypair before airdrop:",
      await anchor.getProvider().connection.getAccountInfo(keypair.publicKey)
    );

    await airdropSol(keypair.publicKey, 1); // 1 SOL

    console.log(
      "owner of keypair after airdrop:",
      (
        await anchor.getProvider().connection.getAccountInfo(keypair.publicKey)
      ).owner.toBase58()
    );

    await program.methods
      .initializeKeypair()
      .accounts({ keypair: keypair.publicKey })
      .signers([keypair]) // the signer must be the keypair
      .rpc();

    console.log(
      "owner of keypair after initialize:",
      (
        await anchor.getProvider().connection.getAccountInfo(keypair.publicKey)
      ).owner.toBase58()
    );
  });

  // An example of ownership transfer by reallocating the account data to zero size
  // it("Change account owner by realloc", async () => {
  //   const deployer = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(privateKey));

  //   const seeds = []
  //   const [myStorage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);

  //   console.log("the storage account address is", myStorage.toBase58());

  //   await program.methods.initialize().accounts({myStorage: myStorage}).rpc();
  //   await program.methods.changeOwner().accounts({myStorage: myStorage}).rpc();

  //   // after the ownership has been transferred
  //   // the account can still be initialized again
  //   await program.methods.initialize().accounts({myStorage: myStorage}).rpc();
  // });
});
