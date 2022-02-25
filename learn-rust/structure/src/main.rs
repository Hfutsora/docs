
#[derive(Debug)]
struct User {
    username: String,
    email: String,
    active: bool,
}

impl User {
    fn get_name(&self) -> &str { // method
        &self.username
    }

    fn create() -> User { // associated functions
        User {
            username: String::from("f"),
            email: String::from("ee"),
            active: true
        }
    }
}

struct Color (i32, i32, i32);

fn main() {
    let user1 = build_user("sora", "com");
    println!("{}, {}, {}", user1.active, user1.email, user1.username);

    let user2 = User {
        username: String::from("clyne"),
        ..user1
    };
    println!("{:#?}", user2);

    let black = Color(0, 0, 0);
    println!("{}", black.0);

    println!("fn name {}", User::create().get_name())
}

fn build_user(username: &str, email: &str) -> User {
    User {
        username: String::from(username),
        email: String::from(email),
        active: false
    }
}