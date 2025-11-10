use anchor_lang::prelude::*;

declare_id!("2jNg9z8D6Jo9Sn2iUAWLwGrhMb8XkWxNVFhZ5iSKXYL2");

#[program]
pub mod day28_batch_multicall_builtin {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn set(ctx: Context<Set>, new_val: u32) -> Result<()> {
        ctx.accounts.pda.value = new_val;
        Ok(())
        // Intentionally trigger an error to test batch transaction rollback
        // err!(Error::AlwaysFails)
    }
}

#[error_code]
pub enum Error {
    #[msg("always fails")]
    AlwaysFails,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = size_of::<PDA>() + 8, seeds = [], bump)]
    pub pda: Account<'info, PDA>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Set<'info> {
    #[account(mut)]
    pub pda: Account<'info, PDA>,
}

#[account]
pub struct PDA {
    pub value: u32,
}
