import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day15SolComputeUnit } from "../target/types/day15_sol_compute_unit";

describe("day15-sol-compute-unit", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .day15SolComputeUnit as Program<Day15SolComputeUnit>;

  const defaultKeyPair = new anchor.web3.PublicKey(
    "8n4bVXhHbhYS2xCC6Lih37ffpcBoyTtnphB2UQ1PjDsn"
  );

  it("Is initialized!", async () => {
    let balBefore = await program.provider.connection.getBalance(
      defaultKeyPair
    );
    console.log("Balance before: ", balBefore);

    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);

    let balAfter = await program.provider.connection.getBalance(defaultKeyPair);
    console.log("Balance after: ", balAfter);

    // Log difference in balance
    console.log(
      "Balance difference: ",
      BigInt(balBefore.toString()) - BigInt(balAfter.toString())
    );
  });
});
