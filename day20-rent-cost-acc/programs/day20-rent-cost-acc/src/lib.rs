use anchor_lang::prelude::*;

declare_id!("8sfS4Vk26FAsxVZwZ7KJK34hyZgJQEVrb1CMLufAs5U8");

#[program]
pub mod day20_rent_cost_acc {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn increase_account_size(_ctx: Context<IncreaseAccountSize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer=signer, space=size_of::<BasicStorage>() + 8, seeds=[], bump)]
    pub basic_storage: Account<'info, BasicStorage>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct IncreaseAccountSize<'info> {
    #[account(mut,
              // ***** 1,000 BYTE INCREMENT IS OVER HERE *****
              realloc = size_of::<BasicStorage>() + 8 + 1000,
              realloc::payer = signer,
              realloc::zero = false, // don't zero new bytes
              seeds = [],
              bump)]
    pub basic_storage: Account<'info, BasicStorage>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct BasicStorage {
    pub data: u64,
}
