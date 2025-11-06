import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day20RentCostAcc } from "../target/types/day20_rent_cost_acc";

describe("day20-rent-cost-acc", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .day20RentCostAcc as Program<Day20RentCostAcc>;

  it("Is initialized!", async () => {
    const [basicStorage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [],
      program.programId
    );

    const tx = await program.methods
      .initialize()
      .accounts({
        basicStorage,
      })
      .rpc();
    await program.methods
      .increaseAccountSize()
      .accounts({
        basicStorage,
      })
      .rpc();

    console.log("Basic Storage Account:", basicStorage.toBase58());

    console.log("Your transaction signature", tx);
  });
});
