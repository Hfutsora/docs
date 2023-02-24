import { Lexer, Token, ListLexer } from './lexer1'

// LL(1)
export class Parser {
  input: Lexer
  lookahead: Token | undefined

  constructor(input: Lexer) {
    this.input = input
    this.consume()
  }

  match(tokenType: number) {
    if (this.lookahead?.type === tokenType) {
      this.consume()
    } else {
      throw new Error('expecting ' + this.input.getTokenName(tokenType) + '; found ' + this.lookahead?.type)
    }
  }
  consume() {
    this.lookahead = this.input.nextToken()
  }
}

export class ListParser extends Parser {
  // list: '[' elements ']' 连续模式 A B
  list() {
    this.match(ListLexer.LBRACK)
    this.elements()
    this.match(ListLexer.RBRACK)
    console.log("match list")
  }
  // elements: element (',' element)* 重复模式 A*
  elements() {
    this.element()
    while (this.lookahead?.type === ListLexer.COMMA) {
      this.match(ListLexer.COMMA)
      this.element()
    }
  }
  // element: Name | list 选择模式 A | B
  element() {
    if (this.lookahead?.type === ListLexer.NAME) {
      this.match(ListLexer.NAME)
    } else if (this.lookahead?.type === ListLexer.LBRACK) {
      this.list()
    } else {
      throw new Error('expecting name or list; found ' + this.lookahead?.type)
    }
  }
}

// test
// let l1 = "[hello, world]"
// let l2 = "[a, [b, [c, d]]]"

// const lexer1 = new ListLexer(l1)
// const parser1 = new ListParser(lexer1)
// parser1.list()

// const lexer2 = new ListLexer(l2)
// const parser2 = new ListParser(lexer2)
// parser2.list()