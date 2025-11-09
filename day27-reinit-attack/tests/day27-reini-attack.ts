import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day27ReiniAttack } from "../target/types/day27_reini_attack";

describe("day27-reini-attack", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .day27ReiniAttack as Program<Day27ReiniAttack>;

  it("initialize after giving to system program or draining lamports", async () => {
    const [myPda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [],
      program.programId
    );

    await program.methods.initialize().accounts({ myPda: myPda }).rpc();

    await program.methods
      .giveToSystemProgram()
      .accounts({ myPda: myPda })
      .rpc();

    await program.methods.initialize().accounts({ myPda: myPda }).rpc();
    console.log("account initialized after giving to system program!");

    await program.methods.drainLamports().accounts({ myPda: myPda }).rpc();

    await program.methods.initialize().accounts({ myPda: myPda }).rpc();
    console.log("account initialized after draining lamports!");
  });

  it("erase account data and re-initialize", async () => {
    const [myPda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [],
      program.programId
    );

    console.log("erasing account data...");
    await program.methods.erase().accounts({ myPda: myPda }).rpc();

    // Should fail if re-initialize does not work
    console.log("re-initializing account...");
    await program.methods.initialize().accounts({ myPda: myPda }).rpc();
  });
});
