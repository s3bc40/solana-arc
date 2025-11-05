import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day16AccountBasicStorage } from "../target/types/day16_account_basic_storage";

describe("day16-account-basic-storage", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .day16AccountBasicStorage as Program<Day16AccountBasicStorage>;

  it("Is initialized!", async () => {
    const seeds = [];
    const [myStorage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );

    console.log("Storage account address is", myStorage.toBase58());

    const tx = await program.methods
      .initialize()
      .accounts({
        myStorage: myStorage,
      })
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
