use anchor_lang::prelude::*;

declare_id!("612sJPwccC4MUxjQ7CoaS72DXe1sgxC617UZiyeqgXx5");

#[program]
pub mod day32_data_holder_on_chain {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn set(ctx: Context<Set>, value: u64) -> Result<()> {
        let storage = &mut ctx.accounts.storage;
        // storage.x = u64::pow(value, 32);
        storage.x = value;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = size_of::<Storage>() + 8, seeds = [], bump)]
    pub storage: Account<'info, Storage>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Set<'info> {
    #[account(mut)]
    pub storage: Account<'info, Storage>,
}

#[account]
pub struct Storage {
    pub x: u64,
}
