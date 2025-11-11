use anchor_lang::prelude::*;
// account struct for add_and_storeuse bob::cpi::accounts::BobAddOp;

// The program definition for Bob
use day33_cpi_bob::program::Day33CpiBob as Bob;

// the account where Bob is storing the sum
use day33_cpi_bob::BobData;

use day33_cpi_bob::cpi::accounts::BobAddOp;

declare_id!("J9RZhLNPqW6ZktZQhnoVpxCqnbAC1kQzmfRCetY4A6hu");

#[program]
pub mod alice {
    use super::*;

    pub fn ask_bob_to_add(ctx: Context<AliceOp>, a: u64, b: u64) -> Result<()> {
        // Calls the `bob_add_operation` function in bob program
        let res = day33_cpi_bob::cpi::add_and_store(ctx.accounts.add_function_ctx(), a, b);

        if res.is_ok() {
            return Ok(());
        } else {
            return err!(Errors::CPIToBobFailed);
        }
    }
}

impl<'info> AliceOp<'info> {
    pub fn add_function_ctx(&self) -> CpiContext<'_, '_, '_, 'info, BobAddOp<'info>> {
        // The bob program we are interacting with
        let cpi_program = self.bob_program.to_account_info();

        // Passing the necessary account(s) to the `BobAddOp` account struct in Bob program
        let cpi_account = BobAddOp {
            bob_data_account: self.bob_data_account.to_account_info(),
        };

        // Creates a `CpiContext` object using the new method
        CpiContext::new(cpi_program, cpi_account)
    }
}

#[error_code]
pub enum Errors {
    #[msg("cpi to bob failed")]
    CPIToBobFailed,
}

#[derive(Accounts)]
pub struct AliceOp<'info> {
    #[account(mut)]
    pub bob_data_account: Account<'info, BobData>,
    pub bob_program: Program<'info, Bob>,
}
