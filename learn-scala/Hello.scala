@main def hello() = {
  var num: Int = 1
  num = 2

  println(num)

  val x = 3.3F
  val name = "sora"
  val c: Char = 'c'

  println(s"Name: $name $c ${num + 1}")
}
