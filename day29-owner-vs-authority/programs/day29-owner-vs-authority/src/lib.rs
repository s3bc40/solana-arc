use anchor_lang::prelude::*;

declare_id!("2txCXcbrjV17Zk8vnAorKBbNYdBZ5GyBUaBz4frMkH8n");

#[program]
pub mod day29_owner_vs_authority {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'init> {
    #[account(init, payer = signer, space = size_of::<StoragePDA>() + 8, seeds = [], bump)]
    pub storage_pda: Account<'init, StoragePDA>,

    #[account(mut)]
    pub signer: Signer<'init>,
    pub system_program: Program<'init, System>,
}

#[account]
pub struct StoragePDA {}
