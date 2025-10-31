use anchor_lang::prelude::*;

declare_id!("FsZCssUpWrUSmrzH4yuKkbrsPZ9uqrEVWhqpGWj9HLsM");

#[program]
pub mod day4 {
    use super::*;

    pub fn limit_range(_ctx: Context<LimitRange>, a: u64) -> Result<()> {
        // if a < 10 {
        //     return err!(MyError::AisTooSmall);
        // }
        // if a > 100 {
        //     return err!(MyError::AisTooBig);
        // }
        // With require macro from Anchor
        require!(a >= 10, MyError::AisTooSmall);
        require!(a <= 100, MyError::AisTooBig);

        msg!("Result = {}", a);
        Ok(())
    }

    pub fn func(_ctx: Context<LimitRange>) -> Result<()> {
        msg!("Will this print?");
        return err!(MyError::AlwaysErrors);
    }
}

#[derive(Accounts)]
pub struct LimitRange {}

#[error_code]
pub enum MyError {
    #[msg("a is too big")]
    AisTooBig,
    #[msg("a is too small")]
    AisTooSmall,
    #[msg("Always errors")]
    AlwaysErrors,
}
