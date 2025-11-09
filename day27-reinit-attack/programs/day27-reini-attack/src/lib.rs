use anchor_lang::prelude::*;

declare_id!("E58Ehn5Z9LxUxm5dhpivLTjYQkwoRjRmTz28H7Yxsuwh");

#[program]
pub mod day27_reini_attack {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn drain_lamports(ctx: Context<DrainLamports>) -> Result<()> {
        let lamports = ctx.accounts.my_pda.to_account_info().lamports();
        ctx.accounts.my_pda.sub_lamports(lamports)?;
        ctx.accounts.signer.add_lamports(lamports)?;
        Ok(())
    }

    pub fn give_to_system_program(ctx: Context<GiveToSystemProgram>) -> Result<()> {
        let account_info = &mut ctx.accounts.my_pda.to_account_info();
        // the assign method changes the owner
        account_info.assign(&system_program::ID);
        account_info.resize(0)?;

        Ok(())
    }

    pub fn erase(ctx: Context<Erase>) -> Result<()> {
        ctx.accounts.my_pda.resize(0)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct DrainLamports<'info> {
    #[account(mut)]
    pub my_pda: Account<'info, MyPDA>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8, seeds = [], bump)]
    pub my_pda: Account<'info, MyPDA>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GiveToSystemProgram<'info> {
    #[account(mut)]
    pub my_pda: Account<'info, MyPDA>,
}

#[derive(Accounts)]
pub struct Erase<'info> {
    /// CHECK: We are going to erase the account
    #[account(mut)]
    pub my_pda: UncheckedAccount<'info>,
}

#[account]
pub struct MyPDA {}
