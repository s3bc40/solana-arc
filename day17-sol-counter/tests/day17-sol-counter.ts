import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day17SolCounter } from "../target/types/day17_sol_counter";
import { BN } from "bn.js";

describe("day17-sol-counter", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.day17SolCounter as Program<Day17SolCounter>;

  it("Is initialized!", async () => {
    const [myStorage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [],
      program.programId
    );
    const tx_deploy = await program.methods
      .initialize()
      .accounts({
        myStorage: myStorage,
      })
      .rpc();
    console.log("Your transaction signature", tx_deploy);
    console.log("Account deployed at", myStorage.toBase58());

    const tx_set = await program.methods
      .set(new BN(170))
      .accounts({
        myStorage: myStorage,
      })
      .rpc();
    console.log("Your transaction signature", tx_set);

    await program.methods.printX().accounts({ myStorage: myStorage }).rpc();

    await program.methods
      .increment()
      .accounts({
        myStorage: myStorage,
      })
      .rpc();
  });
});
