import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day18ReadFrontendAccSol } from "../target/types/day18_read_frontend_acc_sol";

describe("day18-read-frontend-acc-sol", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .day18ReadFrontendAccSol as Program<Day18ReadFrontendAccSol>;

  it("Is initialized!", async () => {
    const seeds = [];
    const [myStorage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );

    console.log("the storage account address is", myStorage.toBase58());

    await program.methods.initialize().accounts({ myStorage: myStorage }).rpc();
    await program.methods
      .set(new anchor.BN(170))
      .accounts({ myStorage: myStorage })
      .rpc();

    // ***********************************
    // *** NEW CODE TO READ THE STRUCT ***
    // ***********************************
    let myStorageStruct = await program.account.myStorage.fetch(myStorage);
    console.log("The value of x is:", myStorageStruct.x.toString());
  });
});
