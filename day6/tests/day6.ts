import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day6 } from "../target/types/day6";

describe("day6", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.day6 as Program<Day6>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });

  it("age check", async () => {
    const tx = await program.methods.ageChecker(new anchor.BN(25)).rpc();
    console.log("Your transaction signature", tx);
  });

  it("age check match", async () => {
    const tx = await program.methods.ageCheckerMatch(new anchor.BN(5)).rpc();
    console.log("Your transaction signature", tx);
  });

  it("for loop test", async () => {
    const tx = await program.methods.forLoopExample().rpc();
    console.log("Your transaction signature", tx);
  });

  it("fixed array test", async () => {
    const tx = await program.methods.fixedArrayExample().rpc();
    console.log("Your transaction signature", tx);
  });

  it("dynamic array test", async () => {
    const tx = await program.methods.dynamicArrayExample().rpc();
    console.log("Your transaction signature", tx);
  });

  it("hashmap test", async () => {
    // Add your test here.
    const tx = await program.methods.hashMapExample("name", "Bob").rpc();
    console.log("Your transaction signature", tx);
  });

  it("struct test", async () => {
    // Add your test here.
    const tx = await program.methods
      .structExample("Alice", new anchor.BN(20))
      .rpc();
    console.log("Your transaction signature", tx);
  });

  it("from vec to even numbers test", async () => {
    // Add your test here.
    const numbers = [];
    for (let i = 1; i <= 10; i++) {
      numbers.push(new anchor.BN(i));
    }
    const tx = await program.methods.fromVecToEvenNumbers(numbers).rpc();
    console.log("Your transaction signature", tx);
  });
});
