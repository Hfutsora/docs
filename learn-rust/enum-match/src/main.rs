
fn main() {
    let y: Option<i32> = Some(5);
    
    if y.is_some() {
        println!("Y is some");
    }
    
    println!("Coin, {}", value_in_cents(Coin::Quarter(UsState::Alabama)));

    let six = plus_one(y);
    println!("match some, {:?}", six);

    let some_u8_value = Some(3);

    match some_u8_value {
        Some(3) => println!("three"),
        _ => (),
    }

    if let Some(2) = some_u8_value { // if let
        println!("three");
    } else {
        print!("Not three");
    }

}

#[derive(Debug)] // 这样可以可以立刻看到州的名称

enum UsState {
    Alabama,
    Alaska,
}

enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("Q, {:?}", state);
            25
        },
    }
}

fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}