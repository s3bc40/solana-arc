use anchor_lang::prelude::*;

declare_id!("GebiYjDnVAredgBkW5438makabvJrysXh9Lan1b3xF6f");

#[program]
pub mod day1 {
    use super::*;

    pub fn initialize2(ctx: Context<Initialize>) -> Result<()> {
        msg!("Hello, world!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
