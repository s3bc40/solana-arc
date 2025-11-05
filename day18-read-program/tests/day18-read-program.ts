import * as anchor from "@coral-xyz/anchor";
import * as fs from "fs";

describe("read", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  it("Read other account", async () => {
    // the other program's programdId
    const otherProgramAddress = "5NEBwTSFVPJXKfuwa4krtThcCd5ocf3XBYqi7zxTCALG";
    const otherProgramId = new anchor.web3.PublicKey(otherProgramAddress);

    // load the other program's idl -- make sure the path is correct
    const otherIdl = JSON.parse(
      fs.readFileSync(
        "../day18-other-program/target/idl/other_program.json",
        "utf8"
      )
    );

    const otherProgram = new anchor.Program(otherIdl, anchor.getProvider());

    const seeds = [];
    const [trueOrFalseAcc, _bump] =
      anchor.web3.PublicKey.findProgramAddressSync(seeds, otherProgramId);
    let otherStorageStruct = await otherProgram.account.trueOrFalse.fetch(
      trueOrFalseAcc
    );

    console.log("The value of flag is:", otherStorageStruct.flag.toString());

    // With SOLANA RPC methods
    const connection = new anchor.web3.Connection(
      "http://127.0.0.1:8899",
      "confirmed"
    );
    const otherProgramJSON = await connection.getAccountInfo(otherProgramId);
    console.log(
      "otherProgramJSON Info:",
      JSON.stringify(otherProgramJSON, null, 2)
    );
  });
});
