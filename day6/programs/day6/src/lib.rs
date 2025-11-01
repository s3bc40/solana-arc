use anchor_lang::prelude::*;

declare_id!("9vLioRBwmTp93Ep65c83giZtGyhaxNPk2g5hm1i7xLTe");

// *** CONSTANT DECLARED HERE ***
const MEANING_OF_LIFE_AND_EXISTENCE: u64 = 42;

#[program]
pub mod day6 {
    use super::*;
    // Importing HashMap
    use std::collections::HashMap;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        msg!(
            "The meaning of life and existence is: {}",
            MEANING_OF_LIFE_AND_EXISTENCE
        );
        Ok(())
    }

    pub fn age_checker(_ctx: Context<Initialize>, age: u64) -> Result<()> {
        let result = if age >= 18 {
            "You are 18 years old or above"
        } else {
            "You are below 18 years old"
        };
        msg!("{:?}", result);
        Ok(())
    }

    pub fn age_checker_match(_ctx: Context<Initialize>, age: u64) -> Result<()> {
        match age {
            1 => {
                // Code block executed if age equals 1
                msg!("The age is 1");
            }
            2 | 3 => {
                // Code block executed if age equals 2 or 3
                msg!("The age is either 2 or 3");
            }
            4..=6 => {
                // Code block executed if age is in the
                // range 4 to 6 (inclusive)
                msg!("The age is between 4 and 6");
            }
            _ => {
                // Code block executed for any other age
                msg!("The age is something else");
            }
        }
        Ok(())
    }

    pub fn for_loop_example(_ctx: Context<Initialize>) -> Result<()> {
        for i in (0..=12).step_by(2) {
            msg!("Iteration number: {}", i);
        }
        Ok(())
    }

    pub fn fixed_array_example(_ctx: Context<Initialize>) -> Result<()> {
        // Declare an array of u32 with a fixed size of 5
        let my_array: [u32; 5] = [10, 20, 30, 40, 50];

        // Accessing elements of the array
        let first_element = my_array[0];
        let third_element = my_array[2];

        // Declare a mutable array of u32 with a fixed size of 3
        let mut mutable_array: [u32; 3] = [100, 200, 300];

        // Change the second element from 200 to 250
        mutable_array[1] = 250;

        msg!("Array debug info: {:#?}", my_array);
        msg!("First element of my_array: {}", first_element);
        msg!("Third element of my_array: {}", third_element);
        msg!(
            "Modified second element of mutable_array: {}",
            mutable_array[1]
        );

        Ok(())
    }

    pub fn dynamic_array_example(_ctx: Context<Initialize>) -> Result<()> {
        // Create a new dynamic vector of u32
        let mut my_vector: Vec<u32> = Vec::new();

        // Add elements to the vector
        my_vector.push(5);
        my_vector.push(10);
        my_vector.push(15);

        // Accessing elements of the vector
        let first_element = my_vector[0];
        let second_element = my_vector[1];

        // Modify an element in the vector
        my_vector[2] = 20;

        msg!("Vector debug info: {:#?}", my_vector);
        msg!("First element of my_vector: {}", first_element);
        msg!("Second element of my_vector: {}", second_element);
        msg!("Modified third element of my_vector: {}", my_vector[2]);

        Ok(())
    }

    pub fn hash_map_example(_ctx: Context<Initialize>, key: String, value: String) -> Result<()> {
        // Initialize the mapping
        let mut my_map = HashMap::new();

        // Add a key-value pair to the mapping
        my_map.insert(key.to_string(), value.to_string());

        // Log the value corresponding to a key from the mapping
        msg!("My name is {}", my_map[&key]);

        Ok(())
    }

    pub fn struct_example(_ctx: Context<Initialize>, name: String, age: u64) -> Result<()> {
        // Defining a struct in Solana
        struct Person {
            my_name: String,
            my_age: u64,
        }

        // Creating an instance of the struct
        let mut person1: Person = Person {
            my_name: name,
            my_age: age,
        };

        msg!("{} is {} years old", person1.my_name, person1.my_age);

        // Accessing and modifying struct fields
        person1.my_name = "Bob".to_string();
        person1.my_age = 18;

        msg!("{} is {} years old", person1.my_name, person1.my_age);

        Ok(())
    }

    pub fn from_vec_to_even_numbers(_ctx: Context<Initialize>, numbers: Vec<u64>) -> Result<()> {
        // Filter even numbers from the input vector
        let even_numbers: Vec<u64> = numbers.into_iter().filter(|x| x % 2 == 0).collect();

        msg!("Even numbers: {:#?}", even_numbers);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
