import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day27InitIfNeededSecu } from "../target/types/day27_init_if_needed_secu";

describe("day27-init-if-needed-secu", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .Day27InitIfNeededSecu as Program<Day27InitIfNeededSecu>;

  it("Is initialized!", async () => {
    const [myPda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [],
      program.programId
    );
    await program.methods.increment().accounts({ myPda: myPda }).rpc();
    await program.methods.increment().accounts({ myPda: myPda }).rpc();
    await program.methods.increment().accounts({ myPda: myPda }).rpc();

    let result = await program.account.myPda.fetch(myPda);
    console.log(`counter is ${result.counter}`);
  });
});
