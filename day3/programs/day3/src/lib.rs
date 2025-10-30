use anchor_lang::prelude::*;

declare_id!("4zRmsAJHpKa3pJn6unFLVzSc6fsPqd1gv8SbPb1PT2JX");

#[program]
pub mod day3 {
    use super::*;

    pub fn not_initialize_at_all(ctx: Context<Void>, idl_param: u64) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        msg!("IDL Param: {}", idl_param);
        Ok(())
    }

    pub fn add(_ctx: Context<Void>, a: u64, b: u64) -> Result<()> {
        msg!("The sum of {} + {} = {}", a, b, a + b);
        Ok(())
    }

    pub fn sub(_ctx: Context<Void>, a: u64, b: u64) -> Result<()> {
        msg!("The difference of {} - {} = {}", a, b, a - b);
        Ok(())
    }

    pub fn mul(_ctx: Context<Void>, a: u64, b: u64) -> Result<()> {
        msg!("Multiplication of {} * {} = {}", a, b, a * b);
        Ok(())
    }

    pub fn modulo(_ctx: Context<Void>, a: u64, b: u64) -> Result<()> {
        msg!("Modulo of {} % {} = {}", a, b, a % b);
        Ok(())
    }

    pub fn not_void(ctx: Context<NotVoid>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn function_a(_ctx: Context<NotVoid>) -> Result<()> {
        Ok(())
    }

    pub fn function_b(_ctx: Context<Void>, _first_arg: u64) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Void {}

#[derive(Accounts)]
pub struct NotVoid<'info> {
    signer: Signer<'info>,
    other_signer: Signer<'info>,
}
