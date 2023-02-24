import { Lexer, Token } from "./lexer1"

export class LookaheadLexer extends Lexer {
  static NAME = 2
  static COMMA = 3
  static LBRACK = 4
  static RBRACK = 5
  static EQUAL = 6

  static tokenName = ['n/a', '<EOF>', 'NAME', 'COMMA', 'LBRACK', 'RBRACK', '=']

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
          return new Token(LookaheadLexer.COMMA, ',')
        }
        case '[': {
          this.consume()
          return new Token(LookaheadLexer.LBRACK, '[')
        }
        case ']': {
          this.consume()
          return new Token(LookaheadLexer.RBRACK, ']')
        }
        case '=': {
          this.consume()
          return new Token(LookaheadLexer.EQUAL, '=')
        }
        default: {
          if (this.isLETTER()) {
            return this.Name()
          }
          throw new Error(`invalid char: ${this.c}`)
        }
      }
    }

    return new Token(LookaheadLexer.EOF_TYPE, '<EOF>')
  }

  isLETTER() {
    return (this.c >= 'a' && this.c <= 'z') || (this.c >= 'A' && this.c <= 'Z')
  }
  Name() {
    let buf = ''

    while (this.isLETTER()) {
      buf = buf + this.c
      this.consume()
    }

    return new Token(LookaheadLexer.NAME, buf)
  }
  WS() {
    const whitespace = [' ', '\t', '\n', '\r']
    while (whitespace.includes(this.c)) {
      this.consume()
    }
  }

  getTokenName(tokenType: number): string {
    return LookaheadLexer.tokenName[tokenType]
  }
}

// LL(k)
class Parser {
  input: Lexer
  lookahead: Token[]
  k: number
  p = 0

  constructor(input: Lexer, k: number) {
    this.input = input
    this.k = k
    this.lookahead = new Array(k)
    for (let i = 0; i < k; i++) {
      this.consume()
    }
  }

  consume() {
    this.lookahead[this.p] = this.input.nextToken()
    this.p = (this.p + 1) % this.k
  }

  LT(i: number) {
    let temp = (this.p + i - 1) % this.k
    return this.lookahead[temp]
  }
  LA(i: number) {
    return this.LT(i).type
  }

  match(tokenType: number) {
    if (this.LA(1) === tokenType) {
      this.consume()
    } else {
      throw new Error('expecting ' + this.input.getTokenName(tokenType)
        + " found " + this.LT(1))
    }
  }
}

class LookaheadParser extends Parser {
  // list: '[' elements ']' 连续模式 A B
  list() {
    this.match(LookaheadLexer.LBRACK)
    this.elements()
    this.match(LookaheadLexer.RBRACK)
  }
  // elements: element (',' element)* 重复模式 A*
  elements() {
    this.element()
    while (this.LA(1) === LookaheadLexer.COMMA) {
      this.match(LookaheadLexer.COMMA)
      this.element()
    }
  }
  // element: Name | list | Name '=' Name 选择模式 A | B
  element() {
    if (this.LA(1) === LookaheadLexer.NAME
      && this.LA(2) === LookaheadLexer.EQUAL) {
      this.match(LookaheadLexer.NAME)
      this.match(LookaheadLexer.EQUAL)
      this.match(LookaheadLexer.NAME)
      console.log("match equal")
    } else if (this.LA(1) === LookaheadLexer.NAME) {
      this.match(LookaheadLexer.NAME)
      console.log("match name")
    } else if(this.LA(1) === LookaheadLexer.LBRACK) {
      this.list()
      console.log("match list")
    } else {
      throw new Error('expecting name or list; found ' + this.LT(1))
    }
  }
}

// test
let l2 = "[a, [b=e, [c, d]]]"
const lexer2 = new LookaheadLexer(l2)
const parser2 = new LookaheadParser(lexer2, 2)
parser2.list()