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
}

fn another_func(x: u32) -> u32 {

    x + 1
}