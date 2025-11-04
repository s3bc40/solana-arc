use anchor_lang::prelude::*;

declare_id!("HYNYkVciW4muXe5msBrGWnQFHQEHtkHmt6M3ZMmszBrh");

#[program]
pub mod day13_logs_event_sol {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        emit!(MyEvent { value: 42 });
        emit!(MySecondEvent {
            value: 7,
            message: "Hello, Anchor!".to_string()
        });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[event]
pub struct MyEvent {
    pub value: u64,
}

#[event]
pub struct MySecondEvent {
    pub value: u64,
    pub message: String,
}
