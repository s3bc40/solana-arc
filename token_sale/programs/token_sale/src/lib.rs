use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};
use anchor_spl::token::{mint_to, Mint, MintTo, Token, TokenAccount};

declare_id!("BAgxwrfeaLx27tYDBwBaJhz29bSAEwxXabaxZhYuXanu"); // REPLACE THIS WITH YOUR PROGRAM ID OR RUN `anchor sync`

// Tokens per SOL, i.e., 1 SOL == 100 of our tokens
const TOKENS_PER_SOL: u64 = 100;
// Max supply: 1000 tokens (with 9 decimals)
const SUPPLY_CAP: u64 = 1000e9 as u64;

#[program]
pub mod token_sale {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // Set the admin key
        ctx.accounts.admin_config.admin = ctx.accounts.admin.key();
        Ok(())
    }

    pub fn mint(ctx: Context<MintTokens>, lamports: u64) -> Result<()> {
        // Calculate how many tokens to mint (lamports * TOKENS_PER_SOL)
        let amount = lamports
            .checked_mul(TOKENS_PER_SOL)
            .ok_or(Errors::Overflow)?; // If overflow, return error

        // Ensure we don't exceed the max supply
        let current_supply = ctx.accounts.mint.supply;
        let new_supply = current_supply.checked_add(amount).ok_or(Errors::Overflow)?; // If overflow, return error
        require!(new_supply <= SUPPLY_CAP, Errors::SupplyLimit);

        // Send SOL to treasury
        let transfer_instruction = Transfer {
            from: ctx.accounts.buyer.to_account_info(),
            to: ctx.accounts.treasury.to_account_info(),
        };

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_instruction,
        );
        transfer(cpi_context, lamports)?;

        // Create signer seeds for the mint PDA
        let bump = ctx.bumps.mint;
        let signer_seeds: &[&[&[u8]]] = &[&[b"token_mint".as_ref(), &[bump]]];

        // Setup mint instruction with mint as its own authority
        let mint_to_instruction = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.buyer_ata.to_account_info(),
            authority: ctx.accounts.mint.to_account_info(),
        };

        // Create CPI context with `new_with_signer` - allows our token sale program to sign for the mint PDA. This works because the Solana runtime verifies that our program derived the mint PDA with these seeds and bump
        // See here for more: <https://github.com/solana-foundation/developer-content/blob/main/content/guides/getstarted/how-to-cpi-with-signer.md>
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            mint_to_instruction,
            signer_seeds,
        );
        mint_to(cpi_ctx, amount)?;

        Ok(())
    }

    pub fn withdraw_funds(ctx: Context<WithdrawFunds>, amount: u64) -> Result<()> {
        // Check balance
        let treasury_balance = ctx.accounts.treasury.lamports();
        require!(treasury_balance >= amount, Errors::InsufficientFunds);

        // Create signer seeds for PDA
        let bump = ctx.bumps.treasury;
        let signer_seeds: &[&[&[u8]]] = &[&[b"treasury".as_ref(), &[bump]]];

        // Prepare the CPI context to System Program::transfer
        // DO NOT CONFUSE THIS WITH SPL TOKEN TRANSFER
        let transfer_instruction = Transfer {
            from: ctx.accounts.treasury.to_account_info(),
            to: ctx.accounts.admin.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            transfer_instruction,
            signer_seeds,
        );
        transfer(cpi_ctx, amount)?; // DO NOT CONFUSE THIS WITH SPL TOKEN TRANSFER

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>, // The transaction signer

    #[account(
        init,
        payer = admin,
        space = 8+AdminConfig::INIT_SPACE, // 8 is for the discriminator
    )]
    pub admin_config: Account<'info, AdminConfig>,

    #[account(
        init,
        payer = admin,
        seeds = [b"token_mint"],
        bump,
        mint::decimals = 9,
        mint::authority = mint.key(),
    )]
    pub mint: Account<'info, Mint>,

    /// CHECK: PDA for treasury
    #[account(
        seeds = [b"treasury"],
        bump
    )]
    pub treasury: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

// Stores the admin public key
#[account]
#[derive(InitSpace)] // This is a derive attribute macro provided by anchor, it calculates the space needed for the account and gives us access to AdminConfig::INIT_SPACE, as used above
pub struct AdminConfig {
    pub admin: Pubkey,
}

#[derive(Accounts)]
pub struct MintTokens<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"token_mint"],
        bump
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        token::mint = mint,
        token::authority = buyer,
    )]
    pub buyer_ata: Account<'info, TokenAccount>,

    /// CHECK: PDA for treasury
    #[account(
        mut,
        seeds = [b"treasury"],
        bump
    )]
    pub treasury: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        constraint = admin_config.admin == admin.key() @ Errors::UnauthorizedAccess // Ensure the signer is authorized
    )]
    pub admin_config: Account<'info, AdminConfig>,

    /// CHECK: PDA for treasury
    #[account(
        mut,
        seeds = [b"treasury"],
        bump
    )]
    pub treasury: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum Errors {
    #[msg("Max token supply limit reached")]
    SupplyLimit,

    #[msg("Math overflow")]
    Overflow,

    #[msg("Only admin can withdraw")]
    UnauthorizedAccess,

    #[msg("Not enough SOL in treasury")]
    InsufficientFunds,
}
