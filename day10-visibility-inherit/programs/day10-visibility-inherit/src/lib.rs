use anchor_lang::prelude::*;

declare_id!("53hgft52DHUKMPHGu1kusuwxFGk2T8qngwSw2SyGRNrX");

pub mod calculate;

#[program]
pub mod func_visibility {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        // Call the internal_function from within its parent module
        some_internal_function::internal_function();

        Ok(())
    }

    // Internal function
    pub mod some_internal_function {
        pub fn internal_function() {
            // Internal function logic...
        }
    }

    // Private function
    pub mod some_function_function {
        pub(in crate::func_visibility) fn private_function() {
            // Private function logic...
        }
    }

    pub fn add_two_numbers(_ctx: Context<Initialize>, x: u64, y: u64) -> Result<()> {
        // Call `add` function in calculate.rs
        let result = calculate::add(x, y);

        msg!("{} + {} = {}", x, y, result);
        Ok(())
    }
}

mod do_something {
    // Import func_visibility module
    use crate::func_visibility;

    pub fn some_func_here() {
        // Call the internal_function from outside its parent module
        func_visibility::some_internal_function::internal_function();

        // This won't compile because private_function is not accessible here
        // func_visibility::some_function_function::private_function();

        // Do something else...
    }
}

#[derive(Accounts)]
pub struct Initialize {}
