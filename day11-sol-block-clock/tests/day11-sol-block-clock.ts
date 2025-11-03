import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day11SolBlockClock } from "../target/types/day11_sol_block_clock";

describe("day11-sol-block-clock", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .day11SolBlockClock as Program<Day11SolBlockClock>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });

  it("Get day of week!", async () => {
    // Add your test here.
    const tx = await program.methods.getDayOfTheWeek().rpc();
    console.log("Your transaction signature", tx);
  });
});
