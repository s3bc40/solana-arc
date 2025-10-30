import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day3 } from "../target/types/day3";

describe("day3", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.day3 as Program<Day3>;

  it("not initialized at all!", async () => {
    // Add your test here.
    const tx = await program.methods
      .notInitializeAtAll(new anchor.BN(777))
      .rpc();
    console.log("Your transaction signature", tx);
  });

  it("should add two numbers", async () => {
    const a = 10;
    const b = 25;
    const tx = await program.methods
      .add(new anchor.BN(a), new anchor.BN(b))
      .rpc();
    console.log("Addition transaction signature", tx);
  });

  it("should subtract two numbers", async () => {
    const a = 50;
    const b = 15;
    const tx = await program.methods
      .sub(new anchor.BN(a), new anchor.BN(b))
      .rpc();
    console.log("Subtraction transaction signature", tx);
  });

  it("should multiply two numbers", async () => {
    const a = 6;
    const b = 7;
    const tx = await program.methods
      .mul(new anchor.BN(a), new anchor.BN(b))
      .rpc();
    console.log("Multiplication transaction signature", tx);
  });

  it("should modulo two numbers", async () => {
    const a = 20;
    const b = 6;
    const tx = await program.methods
      .modulo(new anchor.BN(a), new anchor.BN(b))
      .rpc();
    console.log("Modulo transaction signature", tx);
  });
});
