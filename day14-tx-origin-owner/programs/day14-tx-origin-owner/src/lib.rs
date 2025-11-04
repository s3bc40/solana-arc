use anchor_lang::prelude::*;

declare_id!("HaR6W1EYd8akDEsoDR5jMBPyRWebWjq58dHW5aP2hjhZ");

// PubKey of our local wallet
const OWNER: &str = "8n4bVXhHbhYS2xCC6Lih37ffpcBoyTtnphB2UQ1PjDsn";

#[program]
pub mod day14_tx_origin_owner {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let the_signer1: &mut Signer = &mut ctx.accounts.signer1;
        let the_signer2: &mut Signer = &mut ctx.accounts.signer2;

        msg!("Greetings from: {:?}", ctx.program_id);

        msg!("The signer1 is: {:?}", the_signer1.key());
        msg!("The signer2 is: {:?}", the_signer2.key());
        Ok(())
    }

    pub fn three_signers(ctx: Context<ThreeSigners>) -> Result<()> {
        let signer1: &mut Signer = &mut ctx.accounts.signer1;
        let signer2: &mut Signer = &mut ctx.accounts.signer2;
        let signer3: &mut Signer = &mut ctx.accounts.signer3;

        msg!("### Signer1 ###: {:?}", signer1.key());
        msg!("### Signer2 ###: {:?}", signer2.key());
        msg!("### Signer3 ###: {:?}", signer3.key());

        Ok(())
    }

    #[access_control(check_owner(&ctx))]
    pub fn only_owner(ctx: Context<Initialize>) -> Result<()> {
        check_owner(&ctx)?;

        msg!(
            "Only owner function called by the owner: {:?}",
            ctx.accounts.signer1.key()
        );

        Ok(())
    }
}

fn check_owner(ctx: &Context<Initialize>) -> Result<()> {
    // Get owner from context or from constant
    let owner_key = match &ctx.accounts.owner {
        signer if signer.is_signer => signer.key(),
        _ => OWNER.parse::<Pubkey>().unwrap(), // turbofish to specify type,
    };
    // Check if the signer1 is the expected OWNER
    require_keys_eq!(
        ctx.accounts.signer1.key(),
        owner_key, // exercise
        OnlyOwnerError::NotOwner
    );

    Ok(())
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer1: Signer<'info>,
    #[account(mut)]
    pub signer2: Signer<'info>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct ThreeSigners<'info> {
    #[account(mut)]
    pub signer1: Signer<'info>,
    #[account(mut)]
    pub signer2: Signer<'info>,
    #[account(mut)]
    pub signer3: Signer<'info>,
}

#[error_code]
pub enum OnlyOwnerError {
    #[msg("Only owner can call this function")]
    NotOwner,
}
