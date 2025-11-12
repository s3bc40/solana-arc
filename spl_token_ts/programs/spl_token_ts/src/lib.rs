use anchor_lang::prelude::*;

declare_id!("6nKxXfEXsy5kqdSDq5xi55Zob3hai9s5E9mG94nVg5i6");

#[program]
pub mod spl_token_ts {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
