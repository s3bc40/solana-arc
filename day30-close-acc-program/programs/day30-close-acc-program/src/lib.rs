use anchor_lang::prelude::*;

declare_id!("8wZY3f5YKjdMmw5jRLyHG8DmjXeDsBcLN96mdd6U1Prj");

#[program]
pub mod day30_close_acc_program {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn delete(_ctx: Context<Delete>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = size_of::<ThePda>() + 8, seeds = [], bump)]
    pub the_pda: Account<'info, ThePda>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// WARNING: anyone can call this instruction to close the account
// because there is no access control implemented.
#[derive(Accounts)]
pub struct Delete<'info> {
    // Solana returns rent for closing accounts
    #[account(mut, close = signer)]
    pub the_pda: Account<'info, ThePda>,

    #[account(mut)]
    pub signer: Signer<'info>,
}

#[account]
pub struct ThePda {
    pub x: u32,
}
