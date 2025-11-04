import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Day13LogsEventSol } from "../target/types/day13_logs_event_sol";

describe("day13-logs-event-sol", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .day13LogsEventSol as Program<Day13LogsEventSol>;

  it("Is initialized!", async () => {
    // Add your test here.
    const listenerMyEvent = program.addEventListener(
      "myEvent",
      (event, slot) => {
        console.log(`slot ${slot} - MyEvent: value = ${event.value}`);
      }
    );
    const listenerMySecondEvent = program.addEventListener(
      "mySecondEvent",
      (event, slot) => {
        console.log(
          `slot ${slot} - MySecondEvent: value = ${event.value}, message = ${event.message}`
        );
      }
    );
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);

    // This line is only for test purposes to ensure the event
    // listener has time to listen to event.
    await new Promise((resolve) => setTimeout(resolve, 5000));

    program.removeEventListener(listenerMyEvent);
    program.removeEventListener(listenerMySecondEvent);
  });
});
