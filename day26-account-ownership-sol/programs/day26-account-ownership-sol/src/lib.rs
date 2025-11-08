use anchor_lang::prelude::*;

declare_id!("3SNrBE9VpETo4LZq6ymSBa3hcUbXnpTaJ9etniFhtesi");

#[program]
pub mod day26_account_ownership_sol {
    use super::*;

    pub fn initialize_keypair(_ctx: Context<InitializeKeypair>) -> Result<()> {
        Ok(())
    }

    pub fn initialize_pda(_ctx: Context<InitializePda>) -> Result<()> {
        Ok(())
    }

    pub fn change_owner(ctx: Context<ChangeOwner>) -> Result<()> {
        let account_info = &mut ctx.accounts.my_storage.to_account_info();
        // assing the owner of the account to the program's id
        account_info.assign(&system_program::ID);

        // we need to erase the data in the account to make it valid again
        let res = account_info.resize(0);

        if res.is_err() {
            return err!(Err::ReallocFailed);
        }

        Ok(())
    }
}

#[error_code]
pub enum Err {
    #[msg("realloc failed")]
    ReallocFailed,
}

#[derive(Accounts)]
pub struct InitializeKeypair<'info> {
    #[account(init, payer = signer, space = 8)]
    keypair: Account<'info, Keypair>,
    #[account(mut)]
    signer: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializePda<'info> {
    #[account(init, payer = signer, space = 8, seeds = [], bump)]
    pda: Account<'info, Pda>,
    #[account(mut)]
    signer: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ChangeOwner<'info> {
    #[account(mut)]
    pub my_storage: Account<'info, MyStorage>,
}

#[account]
pub struct Keypair();

#[account]
pub struct Pda();

#[account]
pub struct MyStorage {
    x: u64,
}
