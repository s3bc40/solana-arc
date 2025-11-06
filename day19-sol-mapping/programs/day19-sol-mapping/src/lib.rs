use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("2QWTDhydywRWCgzCxYLQ1Z8dBbjuoMyqSg71Drhqdvi1");

#[program]
pub mod day19_sol_mapping {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>, _key1: u64, _key2: u64, _key3: u64) -> Result<()> {
        Ok(())
    }

    pub fn set(ctx: Context<Set>, _key1: u64, _key2: u64, _key3: u64, val: u64) -> Result<()> {
        ctx.accounts.val.value = val;
        Ok(())
    }

    pub fn initialize_map(
        _ctx: Context<InitializeMap>,
        _which_map: WhichMapKeys,
        _key: u64,
    ) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(key1: u64, key2: u64, key3: u64)]
pub struct Initialize<'info> {
    #[account(init,
              payer = signer,
              space = size_of::<Val>() + 8,
              seeds=[&key1.to_le_bytes().as_ref(), &key2.to_le_bytes().as_ref(), &key3.to_le_bytes().as_ref()],
              bump)]
    val: Account<'info, Val>,

    #[account(mut)]
    signer: Signer<'info>,

    system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(key1: u64, key2: u64, key3: u64)]
pub struct Set<'info> {
    #[account(mut)]
    val: Account<'info, Val>,
}

#[derive(Accounts)]
#[instruction(which_map: WhichMapKeys, key: u64)]
pub struct InitializeMap<'info> {
    #[account(init,
              payer = signer,
              space = size_of::<Val>() + 8,
              seeds=[&which_map.key1.to_le_bytes().as_ref(), &which_map.key2.to_le_bytes().as_ref(), &key.to_le_bytes().as_ref()],
              bump)]
    val: Account<'info, Val>,

    #[account(mut)]
    signer: Signer<'info>,

    system_program: Program<'info, System>,
}

#[account]
pub struct Val {
    value: u64,
}

#[account]
pub struct WhichMapKeys {
    key1: u64,
    key2: u64,
}
