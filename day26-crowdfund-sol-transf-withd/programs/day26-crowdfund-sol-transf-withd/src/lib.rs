use anchor_lang::prelude::*;
use anchor_lang::system_program;
use std::str::FromStr; // trait for Pubkey::from_str

declare_id!("462GfPXGxRpkaEtPH34F1vbFuUWZKbgtuZPfP46NZGEU");

#[program]
pub mod day26_crowdfund_sol_transf_withd {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let initialized_pda = &mut ctx.accounts.pda;
        Ok(())
    }

    pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> {
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.signer.to_account_info().clone(),
                to: ctx.accounts.pda.to_account_info().clone(),
            },
        );

        system_program::transfer(cpi_context, amount)?;

        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        // Note: we should check if we are stil above the rent-exempt threshold to avoid
        // draining the account and making it un-rent-exempt (if we withdraw all lamports, the account
        // will be closed by the runtime)
        ctx.accounts.pda.sub_lamports(amount)?;
        ctx.accounts.signer.add_lamports(amount)?;
        // ctx.accounts.signer.add_lamports(amount + 1)?; // <-- Error processing Instruction 0: sum of account balances before and after instruction do not match.

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space=size_of::<Pda>() + 8, seeds=[], bump)]
    pub pda: Account<'info, Pda>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub pda: Account<'info, Pda>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, address = Pubkey::from_str("BDhtfVMVGBAXE4RP1oStcSLNfdVUru6fWBL71KeYcqwE").unwrap())]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub pda: Account<'info, Pda>,
}

#[account]
pub struct Pda {}
