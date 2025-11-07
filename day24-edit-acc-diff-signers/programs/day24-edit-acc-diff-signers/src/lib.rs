use anchor_lang::prelude::*;

declare_id!("6Z3qKCjqfefMDC9yqh8xz5X1QKbB6LArcAFHM7Wgoudc");

#[program]
pub mod day24_edit_acc_diff_signers {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn update_value(ctx: Context<UpdateValue>, new_value: u64) -> Result<()> {
        let my_storage = &mut ctx.accounts.my_storage;
        my_storage.x = new_value;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer=fren, space=size_of::<MyStorage>() + 8, seeds=[], bump)]
    pub my_storage: Account<'info, MyStorage>,

    #[account(mut)]
    pub fren: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateValue<'info> {
    #[account(mut, seeds=[], bump)]
    pub my_storage: Account<'info, MyStorage>,

    // Need to add signer constraint here
    pub fren: Signer<'info>,
}

#[account]
pub struct MyStorage {
    x: u64,
}
