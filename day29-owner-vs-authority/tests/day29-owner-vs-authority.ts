import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day29OwnerVsAuthority } from "../target/types/day29_owner_vs_authority";

describe("day29-owner-vs-authority", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .day29OwnerVsAuthority as Program<Day29OwnerVsAuthority>;

  it("checking owners and authorithy", async () => {
    const [storagePda, _bump] =
      await anchor.web3.PublicKey.findProgramAddressSync([], program.programId);

    const accountInfo = await anchor
      .getProvider()
      .connection.getAccountInfo(storagePda);

    if (
      accountInfo === null ||
      accountInfo.owner !== program.programId ||
      accountInfo.lamports === 0
    ) {
      console.log("Init required");
      const tx = await program.methods
        .initialize()
        .accounts({ storagePda })
        .transaction();

      await anchor.web3.sendAndConfirmTransaction(
        program.provider.connection,
        tx,
        [program.provider.wallet.payer]
      );
    } else {
      console.log("Already initialized");
    }

    console.log(`program id: ${program.programId.toBase58()}`);
    console.log(`storage pda: ${storagePda.toBase58()}`);
  });
});
