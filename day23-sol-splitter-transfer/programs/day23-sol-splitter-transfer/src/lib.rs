use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("EFDFoMqpiVbcVqzV5QNzmeEWPo5Kh63tFcuxVMh1ULYH");

#[program]
pub mod day23_sol_splitter_transfer {
    use super::*;

    pub fn send_sol(ctx: Context<SendSol>, amount: u64) -> Result<()> {
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.signer.to_account_info(),
                to: ctx.accounts.recipient.to_account_info(),
            },
        );

        let res = system_program::transfer(cpi_context, amount);

        if res.is_ok() {
            return Ok(());
        } else {
            return err!(Errors::TransferFailed);
        }
    }

    pub fn split_sol(ctx: Context<SplitSol>, amount: u64) -> Result<()> {
        let half_amount = amount.checked_div(2).expect("amount cannot be zero");

        let cpi_context1 = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.signer.to_account_info(),
                to: ctx.accounts.recipient1.to_account_info(),
            },
        );

        let cpi_context2 = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.signer.to_account_info(),
                to: ctx.accounts.recipient2.to_account_info(),
            },
        );

        let res1 = system_program::transfer(cpi_context1, half_amount);

        if res1.is_ok() {
            let res2 = system_program::transfer(cpi_context2, half_amount);
            if res2.is_ok() {
                return Ok(());
            } else {
                return err!(Errors::Tranfer2SplitFailed);
            }
        } else {
            return err!(Errors::Tranfer1SplitFailed);
        }
    }

    pub fn split_sol_remaining_accounts<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, SplitSolRemainingAccounts<'info>>,
        amount: u64,
    ) -> Result<()> {
        let amount_per_account = amount / ctx.remaining_accounts.len() as u64;
        let system_program = &ctx.accounts.system_program;

        for recipient in ctx.remaining_accounts {
            let cpi_accounts = system_program::Transfer {
                from: ctx.accounts.signer.to_account_info(),
                to: recipient.to_account_info(),
            };
            let cpi_program = system_program.to_account_info();
            let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

            let res = system_program::transfer(cpi_context, amount_per_account);
            if res.is_err() {
                return err!(Errors::TransferFailed);
            }
        }
        Ok(())
    }
}

#[error_code]
pub enum Errors {
    #[msg("transfer SOL failed")]
    TransferFailed,
    #[msg("tranfer 1 failed, cannot split")]
    Tranfer1SplitFailed,
    #[msg("tranfer 2 failed, cannot split")]
    Tranfer2SplitFailed,
}

#[derive(Accounts)]
pub struct SendSol<'info> {
    /// CHECK: we do not read or write from this account
    #[account(mut)]
    recipient: UncheckedAccount<'info>,

    system_program: Program<'info, System>,

    #[account(mut)]
    signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct SplitSol<'info> {
    /// CHECK: we do not read or write from this account
    #[account(mut)]
    recipient1: UncheckedAccount<'info>,

    /// CHECK: we do not read or write from this account
    #[account(mut)]
    recipient2: UncheckedAccount<'info>,

    system_program: Program<'info, System>,

    #[account(mut)]
    signer: Signer<'info>,
}

// True way to split SOL using remaining accounts
#[derive(Accounts)]
pub struct SplitSolRemainingAccounts<'info> {
    #[account(mut)]
    signer: Signer<'info>,

    system_program: Program<'info, System>,
}
