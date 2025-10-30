use anchor_lang::prelude::*;

declare_id!("7ZXx3trxKFTfaMT1uVS11BuFyGVyq342CR1bAqym9tFF");

#[program]
pub mod day2 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, a: u64, b: u64, message: String) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        msg!("You sent a:{} and b:{}", a, b);
        msg!("Your message: {}", message);
        let result_pow = a.checked_pow(2).unwrap(); // a raised to the power of b
        msg!("Result of {} raised to the power of 2 = {}", a, result_pow);
        Ok(())
    }

    pub fn array(_ctx: Context<Initialize>, arr: Vec<u64>) -> Result<()> {
        msg!("Your array: {:?}", arr);
        Ok(())
    }

    pub fn overflow_test(_ctx: Context<Initialize>, a: u64, b: u64) -> Result<()> {
        // let result = a - b; Overflow with check panic but without check it works
        let result = a.checked_sub(b).expect("None returned overflow guarded"); // Safesty against overflow
        msg!("Result of {} - {} = {}", a, b, result);
        Ok(())
    }

    pub fn calculator(_ctx: Context<Initialize>, a: u64, b: Option<u64>, op: String) -> Result<()> {
        let result = match op.as_str() {
            "add" => a
                .checked_add(b.expect("add: missing b param"))
                .expect("add: overflow"),
            "sub" => a
                .checked_sub(b.expect("sub: missing b param"))
                .expect("sub: underflow"),
            "mul" => a
                .checked_mul(b.expect("mul: missing b param"))
                .expect("mul: overflow"),
            "div" => {
                let b_val = b.expect("div: missing b param");
                if b_val == 0 {
                    panic!("div: division by zero");
                }
                a.checked_div(b_val).expect("div: overflow")
            }
            "sqrt" => (a as f64).sqrt() as u64,
            "log10" => {
                if a == 0 {
                    panic!("log10: cannot take log of zero");
                }
                (a as f64).log10() as u64
            }
            _ => {
                msg!("Unsupported operation: {}", op);
                return Ok(());
            }
        };

        // Handle message formatting based on whether operation uses b parameter
        match op.as_str() {
            "sqrt" | "log10" => msg!("Result of {}({}) = {}", op, a, result),
            _ => msg!("Result of {} {} {} = {}", a, op, b.unwrap(), result),
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
