import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day24ProtoErc20Authority } from "../target/types/day24_proto_erc20_authority";

// this airdrops sol to an address
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

describe("day24-proto-erc20-authority", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .day24ProtoErc20Authority as Program<Day24ProtoErc20Authority>;

  it("Alice transfers points to Bob", async () => {
    const alice = anchor.web3.Keypair.generate();
    const bob = anchor.web3.Keypair.generate();

    // Airdrop sol to Alice and Bob
    await airdropSol(alice.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL);
    await airdropSol(bob.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL);

    // Derive PDA for Alice and Bob
    let seeds_alice = [alice.publicKey.toBytes()];
    const [playerAlice, _bumpA] =
      await anchor.web3.PublicKey.findProgramAddressSync(
        seeds_alice,
        program.programId
      );

    let seed_bob = [bob.publicKey.toBytes()];
    const [playerBob, _bumpB] =
      await anchor.web3.PublicKey.findProgramAddressSync(
        seed_bob,
        program.programId
      );

    // Initialize Alice and Bob accounts
    await program.methods
      .initialize()
      .accounts({
        player: playerAlice,
        signer: alice.publicKey,
      })
      .signers([alice])
      .rpc();

    await program.methods
      .initialize()
      .accounts({
        player: playerBob,
        signer: bob.publicKey,
      })
      .signers([bob])
      .rpc();

    // Alice transfers 4 points to Bob
    await program.methods
      .transferPoints(4)
      .accounts({
        from: playerAlice,
        to: playerBob,
        authority: alice.publicKey,
      })
      .signers([alice])
      .rpc();

    // Fetch updated accounts
    const aliceAccount = (await program.account.player.fetch(playerAlice))
      .points;
    const bobAccount = (await program.account.player.fetch(playerBob)).points;

    // Assert the points
    console.log("Alice's points:", aliceAccount);
    console.log("Bob's points:", bobAccount);

    // Attacker mallory try to steal points from Bob
    const mallory = anchor.web3.Keypair.generate();
    await airdropSol(mallory.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL);

    let seed_mallory = [mallory.publicKey.toBytes()];
    const [stealerMallory, _bumpM] =
      await anchor.web3.PublicKey.findProgramAddressSync(
        seed_mallory,
        program.programId
      );

    // Initialize Mallory account
    await program.methods
      .initialize()
      .accounts({
        player: stealerMallory,
        signer: mallory.publicKey,
      })
      .signers([mallory])
      .rpc();

    // Mallory tries to transfer 3 points from Bob to herself
    await program.methods
      .transferPoints(3)
      .accounts({
        from: playerBob,
        to: stealerMallory,
        authority: mallory.publicKey,
      })
      .signers([mallory])
      .rpc()
      .catch((err) => {
        console.log("Mallory's attack failed as expected:", err.toString());
      });

    // Transfer too many points
    await program.methods
      .transferPoints(10)
      .accounts({
        from: playerAlice,
        to: playerBob,
        authority: alice.publicKey,
      })
      .signers([alice])
      .rpc()
      .catch((err) => {
        console.log(
          "Transfer of too many points failed as expected:",
          err.toString()
        );
      });
  });
});
