use anchor_lang::prelude::*;

declare_id!("8C5Ec7Zxo3VvtVZAXA12e5a5J1SZSCToarf35Ne4qQdL");

#[program]
pub mod day18_read_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
