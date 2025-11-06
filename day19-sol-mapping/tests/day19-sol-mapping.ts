import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day19SolMapping } from "../target/types/day19_sol_mapping";

describe("day19-sol-mapping", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Day19SolMapping as Program<Day19SolMapping>;

  it("Initialize mapping storage and set value", async () => {
    const key1 = new anchor.BN(42);
    const key2 = new anchor.BN(84);
    const key3 = new anchor.BN(168);
    const value = new anchor.BN(7777);

    const seeds = [
      key1.toArrayLike(Buffer, "le", 8),
      key2.toArrayLike(Buffer, "le", 8),
      key3.toArrayLike(Buffer, "le", 8),
    ];

    let valueAccount = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    )[0];

    await program.methods
      .initialize(key1, key2, key3)
      .accounts({ val: valueAccount })
      .rpc();

    // set the value
    await program.methods
      .set(key1, key2, key3, value)
      .accounts({ val: valueAccount })
      .rpc();

    // read the account back
    let result = await program.account.val.fetch(valueAccount);

    console.log(
      `Value stored is ${result.value.toString()} in the account ${valueAccount.toBase58()}`
    );
  });

  it("Initialize mapping storage with one key and one mapping two keys", async () => {
    const whichMap = { key1: new anchor.BN(1), key2: new anchor.BN(2) };
    const key = new anchor.BN(99);

    const seeds = [
      whichMap.key1.toArrayLike(Buffer, "le", 8),
      whichMap.key2.toArrayLike(Buffer, "le", 8),
      key.toArrayLike(Buffer, "le", 8),
    ];

    let valueAccount = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    )[0];

    await program.methods
      .initializeMap(whichMap, key)
      .accounts({ val: valueAccount })
      .rpc();
  });
});
