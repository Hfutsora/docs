use std::vec;

fn main() {
    let mut x = 5;

    println!("x is {}.", x);

    x = 6;

    println!("x is {}.", x);
    

    // scalar 标量 
    // 整型、浮点型、布尔类型和字符类型
    let num: i32 = 1_000;

    println!("num {}", num);

    let boo: bool = true;
    
    println!("boo {}", boo);

    let c = 'c'; // char 字符类型 4 byte

    println!("c {}", c);

    // compound 复合

    let tup: (u32, f64) = (4, 3.02);
    let (x, y) = tup;
    println!("tup {}, {}", x, y);

    let arr: [u32; 5] = [1 ,2, 3,4,5];
    println!("arr {}", arr.len());

    let y = {
        let x = 4;
        x + 1
    };

    println!("y is {}", y);

    println!("x is {}", another_func(4));

    if 4 == 6 {
        println!("=== 6");
    } else if another_func(5) == 7 {
        println!("else if");
    } else {
        println!("else");
    }

    let a = if true {
        6
    } else {
        7
    };

    println!("a is {}", a);

    let mut counter = 0;

    let result = loop {
        counter += 1;

        if counter == 10 {
            break counter * 2;
        }
    };

    println!("The result is {}", result);

    let mut number = 3;

    while number != 0 {
        println!("{}!", number);

        number = number - 1;
    }

    println!("LIFTOFF!!!");


    for element in 1..10 {
        println!("the value is: {}", element);
    }

    // Ownership
    let mut s1 = String::from("hello"); // heap string
    s1.push_str(", world");
    let s2 = s1; // move
    let s3 = s2.clone(); // clone

    println!("{}, {}", s2, s3);

    let mut s4 = String::from("hello world");
    let mut s5 = String::from("world");

    // let r1 = &mut s4;
    // let r2 = &mut s4; // data race

    // println!("{}, {}", r1, r2);
    
    println!("{}", calculate_length(&mut s4, &mut s5)); // reference 使用值但不获取其所有权
    println!("{}", calculate_length(&mut s5, &mut s4));

    println!("{}, {}", s4, s5);

    let word = first_word(&s4);
    println!("{}", word);

    let mut v = vec![1, 2, 3];
    v.push(1);
    v.push(2);

    let third = &v[2];
    println!("The third element is {}", third);

    let fourth = v.get(3);
    match fourth {
        Some(fourth) => println!("The fourth element is {}", fourth),
        None => println!("There is no fourth element."),
    }

    for i in &v {
        println!("{}", i);
    }

    for i in &mut v {
        *i += 50; // 解引用运算符*
    }
}


fn another_func(x: u32) -> u32 {
    x + 1
}

fn calculate_length(s: &mut String, s2: &mut String) -> usize { // borrowing 借用
    s.len() + s2.len()
}

fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    &s[..]
}