use anchor_lang::prelude::*;

declare_id!("5RVHV8vmH5qWMSYC16CJbkEgejLKh7DDSPJrLNqTJHLe");

#[program]
pub mod day25_pda_keypair_acc {
    use super::*;

    pub fn initialize_pda(_ctx: Context<InitializePDA>) -> Result<()> {
        Ok(())
    }

    pub fn initialize_keypair_account(_ctx: Context<InitializeKeypairAccount>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePDA<'info> {
    // This is the program derived address
    #[account(init,
              payer = signer,
              space=size_of::<MyPDA>() + 8,
              seeds = [],
              bump)]
    pub my_pda: Account<'info, MyPDA>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeKeypairAccount<'info> {
    #[account(init, payer = signer, space = size_of::<MyPDA>() + 8)]
    pub my_keypair_account: Account<'info, MyPDA>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct MyPDA {
    x: u64,
}
