import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day30CloseAccProgram } from "../target/types/day30_close_acc_program";

describe("day30-close-acc-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .day30CloseAccProgram as Program<Day30CloseAccProgram>;

  it("Is initialized!", async () => {
    let [thePda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [],
      program.programId
    );
    await program.methods.initialize().accounts({ thePda: thePda }).rpc();
    await program.methods.delete().accounts({ thePda: thePda }).rpc();

    let account = await program.account.thePda.fetchNullable(thePda);
    console.log(account);

    // Initialize again
    await program.methods.initialize().accounts({ thePda: thePda }).rpc();
    account = await program.account.thePda.fetch(thePda);
    console.log(account);
  });
});
