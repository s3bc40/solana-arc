use anchor_lang::prelude::*;
use anchor_lang::solana_program::program as solana_program;
use anchor_lang::solana_program::rent::Rent;
use anchor_lang::solana_program::system_instruction;

declare_id!("1fK5boXrRh4z7YqjDtaamZrfpRivZ2Di5S64jnFcpya"); // RUN ANCHOR SYNC TO UPDATE YOUR PROGRAM ID

#[program]
pub mod basic_bank {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // Initialize the bank account
        let bank = &mut ctx.accounts.bank;
        bank.total_deposits = 0;

        msg!("Bank initialized");
        Ok(())
    }

    pub fn create_user_account(ctx: Context<CreateUserAccount>) -> Result<()> {
        // Initialize the user account
        let user_account = &mut ctx.accounts.user_account;
        user_account.owner = ctx.accounts.user.key();
        user_account.balance = 0;

        msg!("User account created for: {:?}", user_account.owner);
        Ok(())
    }
}

// ACCOUNT STRUCT TO CREATE THE BANK PDA TO STORE TO
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + Bank::INIT_SPACE)] // discriminator + u64
    pub bank: Account<'info, Bank>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// ACCOUNT STRUCT FOR CREATING INDIVIDUAL USER ACCOUNT
#[derive(Accounts)]
pub struct CreateUserAccount<'info> {
    #[account(mut)]
    pub bank: Account<'info, Bank>,

    #[account(
        init,
        payer = user,
        space = 8 + UserAccount::INIT_SPACE, // discriminator + pubkey + u64
        seeds = [b"user-account", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// BANK ACCOUNT TO TRACK TOTAL DEPOSITS ACROSS ALL USERS
#[account]
#[derive(InitSpace)]
pub struct Bank {
    pub total_deposits: u64,
}

// USER-SPECIFIC ACCOUNT TO TRACK INDIVIDUAL USER BALANCES
#[account]
#[derive(InitSpace)]
pub struct UserAccount {
    pub owner: Pubkey,
    pub balance: u64,
}
