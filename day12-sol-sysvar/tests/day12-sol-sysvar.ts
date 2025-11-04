import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day12SolSysvar } from "../target/types/day12_sol_sysvar";

describe("day12-sol-sysvar", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.day12SolSysvar as Program<Day12SolSysvar>;

  // Create a StakeHistory PublicKey object
  // const StakeHistory_PublicKey = new anchor.web3.PublicKey(
  //   "SysvarStakeHistory1111111111111111111111111"
  // );

  // Create a LastRestartSlot PublicKey object
  const LastRestartSlot_PublicKey = new anchor.web3.PublicKey(
    "SysvarLastRestartS1ot1111111111111111111111"
  );

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize(3)
      .accounts({
        // stakeHistory: StakeHistory_PublicKey,
        stakeHistory: anchor.web3.SYSVAR_STAKE_HISTORY_PUBKEY,
        instructionSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY, // Pass the public key of the Instruction sysvar to the list of accounts needed for the instruction
        lastRestartSlot: LastRestartSlot_PublicKey,
      })
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
