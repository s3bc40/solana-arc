import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day28BatchMulticallBuiltin } from "../target/types/day28_batch_multicall_builtin";

describe("day28-batch-multicall-builtin", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .day28BatchMulticallBuiltin as Program<Day28BatchMulticallBuiltin>;

  it("Is initialized!", async () => {
    const wallet = program.provider.wallet.payer;
    const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [],
      program.programId
    );

    // Check if the account already exists
    let accountInfo = await anchor.getProvider().connection.getAccountInfo(pda);

    // Init a new transaction
    let transaction = new anchor.web3.Transaction();

    // 1232 bytes limit for a single transaction
    if (
      accountInfo === null ||
      accountInfo.lamports === 0 ||
      accountInfo.owner === anchor.web3.SystemProgram.programId
    ) {
      console.log("need to initialize account");
      const initTx = await program.methods
        .initialize()
        .accounts({ pda })
        .transaction();
      transaction.add(initTx);
    } else {
      console.log("account already initialized");
    }

    // Set number tx
    // u32 or lower do not need to be BN
    const setTx = await program.methods.set(5).accounts({ pda }).transaction();
    transaction.add(setTx);

    // Send the combined transaction
    await anchor.web3.sendAndConfirmTransaction(
      anchor.getProvider().connection,
      transaction,
      [wallet]
    );

    // Fetch the account and verify
    const pdaAcc = await program.account.pda.fetch(pda);
    console.log("PDA Account Value:", pdaAcc.value);
  });
});
