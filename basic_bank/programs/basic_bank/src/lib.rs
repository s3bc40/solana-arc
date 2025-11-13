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

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        // Ensure deposit amount is greater than zero
        require!(amount > 0, BankError::ZeroAmount);

        let user = &ctx.accounts.user.key();
        let bank = &ctx.accounts.bank.key();

        // Transfer SOL from user to bank account using System Program
        let transfer_ix = system_instruction::transfer(user, bank, amount);
        solana_program::invoke(
            &transfer_ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.bank.to_account_info(),
            ],
        )?;

        // Update user balance
        let user_account = &mut ctx.accounts.user_account;
        user_account.balance = user_account
            .balance
            .checked_add(amount)
            .ok_or(BankError::Overflow)?;

        // Update bank total deposits
        let bank = &mut ctx.accounts.bank;
        bank.total_deposits = bank
            .total_deposits
            .checked_add(amount)
            .ok_or(BankError::Overflow)?;

        msg!("Deposited {} lamports for {}", amount, user);
        Ok(())
    }

    pub fn get_balance(ctx: Context<GetBalance>) -> Result<u64> {
        // Get user account
        let user_account = &ctx.accounts.user_account;
        let balance = user_account.balance;

        msg!("Balance for {}: {} lamports", user_account.owner, balance);
        Ok(balance)
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        // Ensure withdraw amount is greater than zero
        require!(amount > 0, BankError::ZeroAmount);

        // Get accounts
        let bank = &mut ctx.accounts.bank;
        let user_account = &mut ctx.accounts.user_account;
        let user = ctx.accounts.user.key();

        // Check if the user has enough balance
        require!(
            user_account.balance >= amount,
            BankError::InsufficientBalance
        );

        // Update user balance
        user_account.balance = user_account
            .balance
            .checked_sub(amount)
            .ok_or(BankError::Underflow)?;

        // Update bank total deposits
        bank.total_deposits = bank
            .total_deposits
            .checked_sub(amount)
            .ok_or(BankError::Underflow)?;

        // Calculate minimum balance needed to keep the account rent-exempt
        let rent = Rent::get()?;
        let user_account_info = ctx.accounts.user_account.to_account_info();
        let minimum_balance = rent.minimum_balance(user_account_info.data_len());

        // Calculate safe transfer amount (preserving rent-exempt minimum)
        let available_lamports = user_account_info.lamports();
        let transfer_amount = amount.min(available_lamports.saturating_sub(minimum_balance));

        // Transfer SOL: subtract from user account PDA and add to user wallet
        **user_account_info.try_borrow_mut_lamports()? -= transfer_amount;
        **ctx.accounts.user.try_borrow_mut_lamports()? += transfer_amount;

        msg!("Withdrawn {} lamports for {}", amount, user);
        Ok(())
    }
}

#[error_code]
pub enum BankError {
    #[msg("Amount must be greater than zero")]
    ZeroAmount,

    #[msg("Insufficient balance for withdrawal")]
    InsufficientBalance,

    #[msg("Arithmetic overflow")]
    Overflow,

    #[msg("Arithmetic underflow")]
    Underflow,

    #[msg("Insufficient funds in the bank account")]
    InsufficientFunds,

    #[msg("Unauthorized access to user account")]
    UnauthorizedAccess,
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

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub bank: Account<'info, Bank>,

    #[account(
        mut,
        seeds = [b"user-account", user.key().as_ref()],
        bump,
        constraint = user_account.owner == user.key() @ BankError::UnauthorizedAccess // Ensure the signer owns the account
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GetBalance<'info> {
    pub bank: Account<'info, Bank>,

    #[account(
        seeds = [b"user-account", user.key().as_ref()],
        bump,
        constraint = user_account.owner == user.key() @ BankError::UnauthorizedAccess // Ensure the signer owns the account
    )]
    pub user_account: Account<'info, UserAccount>,

    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub bank: Account<'info, Bank>,

    #[account(
        mut,
        seeds = [b"user-account", user.key().as_ref()],
        bump,
        constraint = user_account.owner == user.key() @ BankError::UnauthorizedAccess
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
