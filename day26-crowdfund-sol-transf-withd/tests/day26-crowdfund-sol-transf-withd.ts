import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day26CrowdfundSolTransfWithd } from "../target/types/day26_crowdfund_sol_transf_withd";

describe("day26-crowdfund-sol-transf-withd", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .day26CrowdfundSolTransfWithd as Program<Day26CrowdfundSolTransfWithd>;

  it("Is initialized!", async () => {
    const programId = await program.account.pda.programId;

    let seeds = [];
    let pdaAccount = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      programId
    )[0];

    const tx = await program.methods
      .initialize()
      .accounts({
        pda: pdaAccount,
      })
      .rpc();

    // transfer 2 SOL
    const tx2 = await program.methods
      // .donate(new anchor.BN(2_000_000_000))
      .donate(new anchor.BN(2 * anchor.web3.LAMPORTS_PER_SOL))
      .accounts({
        pda: pdaAccount,
      })
      .rpc();

    console.log(
      "lamport balance of pdaAccount",
      await anchor.getProvider().connection.getBalance(pdaAccount)
    );

    // transfer back 1 SOL
    // the signer is the permitted address
    await program.methods
      .withdraw(new anchor.BN(1_000_000_000))
      .accounts({
        pda: pdaAccount,
      })
      .rpc();

    console.log(
      "lamport balance of pdaAccount",
      await anchor.getProvider().connection.getBalance(pdaAccount)
    );
  });
});
