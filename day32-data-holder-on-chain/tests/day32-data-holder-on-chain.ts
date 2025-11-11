import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day32DataHolderOnChain } from "../target/types/day32_data_holder_on_chain";

describe("day32-data-holder-on-chain", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .day32DataHolderOnChain as Program<Day32DataHolderOnChain>;

  it("Is initialized!", async () => {
    const seeds = [];
    const [storage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );

    let transaction = new anchor.web3.Transaction();
    let accountInfo = await program.provider.connection.getAccountInfo(storage);
    if (
      accountInfo === null ||
      accountInfo.lamports === 0 ||
      accountInfo.owner.toBase58() !== program.programId.toBase58()
    ) {
      console.log("Storage account does not exist. Initializing...");
      let txInit = await program.methods
        .initialize()
        .accounts({ storage })
        .transaction();
      transaction.add(txInit);
    } else {
      console.log("Storage account already exists.");
    }

    console.log("Setting the value...");
    let txSet = await program.methods
      .set(new anchor.BN(9))
      .accounts({ storage })
      .transaction();
    transaction.add(txSet);

    await anchor.web3.sendAndConfirmTransaction(
      program.provider.connection,
      transaction,
      [program.provider.wallet.payer]
    );

    let storageStruct = await program.account.storage.fetch(storage);

    console.log("The value of x is: ", storageStruct.x.toString());

    console.log("Storage account address: ", storage.toBase58());
  });
});
