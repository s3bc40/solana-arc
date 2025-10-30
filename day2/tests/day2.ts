import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day2 } from "../target/types/day2";

describe("day2", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.day2 as Program<Day2>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize(new anchor.BN(777), new anchor.BN(999), "Hello, Solana!")
      .rpc();
    console.log("Your transaction signature", tx);
  });

  it("Array test!", async () => {
    const arr = [new anchor.BN(555), new anchor.BN(666), new anchor.BN(777)];
    const tx = await program.methods.array(arr).rpc();
    console.log("Your transaction signature", tx);
  });

  it("Overflow test!", async () => {
    const tx = await program.methods
      .overflowTest(new anchor.BN(0), new anchor.BN(1))
      .rpc();
    console.log("Your transaction signature", tx);
  });

  // CALCULATOR TESTS
  it("Calculator add test!", async () => {
    const tx = await program.methods
      .calculator(new anchor.BN(10), new anchor.BN(3), "add")
      .rpc();
    console.log("Your transaction signature", tx);
  });

  it("Calculator sub test!", async () => {
    const tx = await program.methods
      .calculator(new anchor.BN(10), new anchor.BN(3), "sub")
      .rpc();
    console.log("Your transaction signature", tx);
  });

  it("Calculator mul test!", async () => {
    const tx = await program.methods
      .calculator(new anchor.BN(10), new anchor.BN(3), "mul")
      .rpc();
    console.log("Your transaction signature", tx);
  });

  it("Calculator div test!", async () => {
    const tx = await program.methods
      .calculator(new anchor.BN(10), new anchor.BN(3), "div")
      .rpc();
    console.log("Your transaction signature", tx);
  });

  it("Calculator sqrt test!", async () => {
    const tx = await program.methods
      .calculator(new anchor.BN(16), null, "sqrt")
      .rpc();
    console.log("Your transaction signature", tx);
  });

  it("Calculator log10 test!", async () => {
    const tx = await program.methods
      .calculator(new anchor.BN(1000), null, "log10")
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
