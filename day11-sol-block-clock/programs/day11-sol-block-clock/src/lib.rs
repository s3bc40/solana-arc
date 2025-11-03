use anchor_lang::prelude::*;

declare_id!("C3big2vBbpVS33phLTWSJKcb8pKcm9xs7K54wG95vZRB");

#[program]
pub mod day11_sol_block_clock {
    use super::*;
    use chrono::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        // Imported from prelude
        let clock = Clock::get()?;
        // Log the current block timestamp
        msg!("Block timestamp: {}", clock.unix_timestamp);
        Ok(())
    }

    pub fn get_day_of_the_week(_ctx: Context<Initialize>) -> Result<()> {
        let clock = Clock::get()?;
        let time_stamp = clock.unix_timestamp; // current timestamp

        let date_time = chrono::DateTime::from_timestamp(time_stamp, 0).unwrap();
        let day_of_the_week = date_time.weekday();

        msg!("Week day is: {}", day_of_the_week);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
