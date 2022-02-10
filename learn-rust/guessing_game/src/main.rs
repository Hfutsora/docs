use rand::prelude::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    let secert = rand::thread_rng().gen_range(1..=100);

    loop {
        println!("Input your guess.");

        let mut guess = String::new();
        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read line.");

        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue
        };

        println!("You guessed: {}. Secert is: {}.", guess, secert);

        match guess.cmp(&secert) {
            Ordering::Less => println!("Less!"),
            Ordering::Greater => println!("Greater!"),
            Ordering::Equal => {
                println!("Equal!");
                break; // end loop
            },
        }
    }
}
