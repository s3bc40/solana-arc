use anchor_lang::prelude::*;

declare_id!("2WaFguTpu9s5o5bncpMTxb2KitV3y3ekQcCUzTEd7xvw");

#[program]
pub mod day5 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        msg!("Should be shown!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
