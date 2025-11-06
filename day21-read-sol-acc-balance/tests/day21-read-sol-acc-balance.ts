import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day21ReadSolAccBalance } from "../target/types/day21_read_sol_acc_balance";

describe("day21-read-sol-acc-balance", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .day21ReadSolAccBalance as Program<Day21ReadSolAccBalance>;

  const pubkey = new anchor.web3.PublicKey(
    "5jmigjgt77kAfKsHri3MHpMMFPo6UuiAMF19VdDfrrTj"
  );

  it("get balance!", async () => {
    // Add your test here.
    const tx = await program.methods
      .readBalance()
      .accounts({ acct: pubkey })
      .rpc();
  });
});
