use anchor_lang::prelude::*;

declare_id!("GjzDzd5hjdwXTTrCBhZf8NxPBcHYcNfEjMuUwvCFM36U");

const STARTING_POINTS: u32 = 10;

#[program]
pub mod day24_proto_erc20_authority {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.player.points = STARTING_POINTS;
        ctx.accounts.player.authority = ctx.accounts.signer.key();

        Ok(())
    }

    pub fn transfer_points(ctx: Context<TransferPoints>, amount: u32) -> Result<()> {
        // WITHOUT ANCHOR ACCOUNT CONSTRAINTS
        // require_keys_eq!(
        //     ctx.accounts.from.authority,
        //     ctx.accounts.signer.key(),
        //     Errors::SignerIsNotAuthority
        // );
        // require_gte!(ctx.accounts.from.points, amount, Errors::InsufficientPoints);

        ctx.accounts.from.points -= amount;
        ctx.accounts.to.points += amount;

        Ok(())
    }
}

#[error_code]
pub enum Errors {
    #[msg("SignerIsNotAuthority")]
    SignerIsNotAuthority,
    #[msg("InsufficientPoints")]
    InsufficientPoints,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = size_of::<Player>() + 8, seeds = [&(signer.as_ref().key().to_bytes())], bump)]
    player: Account<'info, Player>,

    #[account(mut)]
    signer: Signer<'info>,

    system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(amount: u32)] // amount is passed from fn instruction to use in constraints
pub struct TransferPoints<'info> {
    // https://www.anchor-lang.com/docs/references/account-constraints
    #[account(mut, has_one = authority @ Errors::SignerIsNotAuthority, constraint = from.points >= amount @ Errors::InsufficientPoints)]
    from: Account<'info, Player>,

    #[account(mut)]
    to: Account<'info, Player>,
    authority: Signer<'info>,
}

#[account]
pub struct Player {
    points: u32,
    authority: Pubkey,
}
