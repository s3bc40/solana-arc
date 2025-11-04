use anchor_lang::prelude::*;

declare_id!("A8XYBCZ84zD7oEQquofKPdzezqaa42ahM22hLYLt56d7");

#[program]
pub mod day12_sol_sysvar {
    use super::*;
    use anchor_lang::solana_program::sysvar::{instructions, last_restart_slot::LastRestartSlot};

    pub fn initialize(ctx: Context<Initialize>, number: u32) -> Result<()> {
        // Get the Clock sysvar
        let clock = Clock::get()?;

        msg!(
            "clock: {:?}",
            // Retrieve all the details of the Clock sysvar
            clock
        );

        // Get the EpochSchedule sysvar
        let epoch_schedule = EpochSchedule::get()?;

        msg!(
            "epoch schedule: {:?}",
            // Retrieve all the details of the EpochSchedule sysvar
            epoch_schedule
        );

        // Get the Rent sysvar
        let rent_var = Rent::get()?;
        msg!(
            "Rent {:?}",
            // Retrieve all the details of the Rent sysvar
            rent_var
        );

        // Accessing the StakeHistory sysvar
        // Create an array to store the StakeHistory account
        let arr = [ctx.accounts.stake_history.clone()];

        // Create an iterator for the array
        let accounts_iter = &mut arr.iter();

        // Get the next account info from the iterator (still StakeHistory)
        let sh_sysvar_info = next_account_info(accounts_iter)?;

        // Create a StakeHistory instance from the account info
        let stake_history = StakeHistory::from_account_info(sh_sysvar_info)?;

        msg!("stake_history: {:?}", stake_history);

        // Get Instruction sysvar
        let arr = [ctx.accounts.instruction_sysvar.clone()];

        let account_info_iter = &mut arr.iter();

        let instructions_sysvar_account = next_account_info(account_info_iter)?;

        // Load the instruction details from the instruction sysvar account
        let instruction_details =
            instructions::load_instruction_at_checked(0, instructions_sysvar_account)?;

        msg!(
            "Instruction details of this transaction: {:?}",
            instruction_details
        );
        msg!("Number is: {}", number);

        // Get LastRestartSlot sysvar
        let arr = [ctx.accounts.last_restart_slot.clone()];
        let account_info_iter = &mut arr.iter();
        let last_restart_slot_account = next_account_info(account_info_iter)?;

        let last_restart_details = LastRestartSlot::from_account_info(last_restart_slot_account);
        msg!("Last Restart Slot details: {:?}", last_restart_details);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    /// CHECK
    pub stake_history: AccountInfo<'info>,
    /// CHECK:
    pub instruction_sysvar: AccountInfo<'info>,
    /// CHECK:
    pub last_restart_slot: AccountInfo<'info>,
}
