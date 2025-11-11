import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day32DataReaderOnChain } from "../target/types/day32_data_reader_on_chain";

describe("day32-data-reader-on-chain", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .day32DataReaderOnChain as Program<Day32DataReaderOnChain>;

  it("Is initialized!", async () => {
    // CHANGE THIS TO THE ADDRESS OF THE PDA OF
    // DATA ACCOUNT HOLDER
    const otherStorageAddress = "Etmm4fqb5BENH2FM6JkVNsGy9u9ppyF91QzKFVpWZMg9";

    const pub_key_other_storage = new anchor.web3.PublicKey(
      otherStorageAddress
    );

    const tx = await program.methods
      .readOtherData()
      .accounts({ otherData: pub_key_other_storage })
      .rpc();
  });
});
