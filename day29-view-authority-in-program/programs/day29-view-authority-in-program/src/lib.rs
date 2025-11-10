use anchor_lang::prelude::*;

declare_id!("J89LeJv9qWgS1LBFkNRZTFvVVKyZpZu6Z126YWwV75yh");

#[program]
pub mod day29_view_authority_in_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
