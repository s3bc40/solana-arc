use anchor_lang::prelude::*;

declare_id!("HuTh19Cp6MMGETbr7JiDJXepUYrwb2Z4PoGiyymAaCmz");

#[program]
pub mod day15_sol_compute_unit {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        // 490 CU -> 5000n lamports
        // let mut a = Vec::new();
        // a.push(1);
        // a.push(2);
        // a.push(3);
        // a.push(4);
        // a.push(5);

        // 382 CU -> 5000n lamports
        let mut a: Vec<u8> = Vec::new();
        a.push(1);
        a.push(2);
        a.push(3);
        a.push(4);
        a.push(5);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
