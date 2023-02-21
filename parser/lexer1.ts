class Token {
  type: number
  text: string

  constructor(type: number, text: string) {
    this.type = type
    this.text = text
  }

  toString() {
    return `{ type: ${this.type}, text: ${this.text} }`
  }
}

abstract class Lexer {
  static EOF: string = String.fromCharCode(-1)
  static EOF_TYPE = 1

  input: string
  p = 0
  c: string

  constructor(input: string) {
    this.input = input
    this.c = this.input.charAt(this.p)
  }

  consume() {
    this.p = this.p + 1
    if (this.p >= this.input.length) {
      this.c = Lexer.EOF
    } else {
      this.c = this.input.charAt(this.p)
    }
  }

  match(x: string) {
    if (this.c === x) {
      this.consume()
    } else {
      throw new Error(`expecting: ${x} found ${this.c}`)
    }
  }

  abstract nextToken(): Token
  abstract getTokenName(tokenType: number): string
}

class ListLexer extends Lexer {
  static NAME = 2
  static COMMA = 3
  static LBRACK = 4
  static RBRACK = 5

  static tokenName = ['n/a', '<EOF>', 'NAME', 'COMMA', 'LBRACK', 'RBRACK']

  nextToken(): Token {
    while (this.c !== Lexer.EOF) {
      switch (this.c) {
        case ' ':
        case '\t':
        case '\n':
        case '\r': {
          this.WS()
          break
        }
        case ',': {
          this.consume()
          return new Token(ListLexer.COMMA, ',')
        }
        case '[': {
          this.consume()
          return new Token(ListLexer.LBRACK, '[')
        }
        case ']': {
          this.consume()
          return new Token(ListLexer.RBRACK, ']')
        }
        default: {
          if (this.isLETTER()) {
            return this.Name()
          }
          throw new Error(`invalid char: ${this.c}`)
        }
      }
    }

    return new Token(ListLexer.EOF_TYPE, '<EOF>')
  }

  isLETTER() {
    return (this.c >= 'a' && this.c <= 'z') || (this.c >= 'A' && this.c <= 'Z')
  }
  Name() {
    let buf = ''

    while(this.isLETTER()) {
      buf = buf + this.c
      this.consume()
    }

    return new Token(ListLexer.NAME, buf)
  }
  WS() {
    const whitespace = [' ', '\t', '\n', '\r']
    while (whitespace.includes(this.c)) {
      this.consume()
    }
  }

  getTokenName(tokenType: number): string {
    return ListLexer.tokenName[tokenType]
  }
}

// test
const input = '[hello, world]'
const lexer = new ListLexer(input)

while(true) {
  let nt = lexer.nextToken()
  if(nt.type !== Lexer.EOF_TYPE) {
    console.log(nt.toString())
  } else {
    break
  }
}

