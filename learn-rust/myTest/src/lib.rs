#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }

    #[test]
    fn another() {
        let a = 1;

        assert_eq!(a, 2, "{} is not equal to 1.", a);
    }
}
