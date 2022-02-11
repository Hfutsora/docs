// https://github.com/type-challenges/type-challenges/blob/master/questions/2-medium-return-type/README.md
const fn = (v: boolean) => {
  if (v)
    return 1
  else
    return 2
}

type a = MyReturnType<typeof fn> // should be "1 | 2"
type MyReturnType<T extends (...args: any[]) => unknown> = T extends (...args: any[]) => infer R ? R : never;

// https://github.com/type-challenges/type-challenges/blob/master/questions/3-medium-omit/README.md
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>

const todo: TodoPreview = {
  completed: false,
}

type MyOmit<T, K extends keyof T> = {[P in Exclude<keyof T, K>]: T[P]};

{
  // https://github.com/type-challenges/type-challenges/blob/master/questions/8-medium-readonly-2/README.md
  interface Todo {
    title: string
    description: string
    completed: boolean
  }

  const todo: MyReadonly2<Todo, 'title' | 'description'> = {
    title: "Hey",
    description: "foobar",
    completed: false,
  }

  // todo.title = "Hello" // Error: cannot reassign a readonly property
  // todo.description = "barFoo" // Error: cannot reassign a readonly property
  todo.completed = true // OK

  type MyReadonly2<T, K extends keyof T> = {
    readonly [P in K]: T[P];
  } & {
    [P in Exclude<keyof T, K>]: T[P]
  }
}

{
  // https://github.com/type-challenges/type-challenges/blob/master/questions/9-medium-deep-readonly/README.md
  type X = { 
    x: { 
      a: 1
      b: 'hi'
    }
    y: 'hey'
  }
  
  type Expected = { 
    readonly x: { 
      readonly a: 1
      readonly b: 'hi'
    }
    readonly y: 'hey' 
  }
  
  type Todo = DeepReadonly<X> // should be same as `Expected`

  type DeepReadonly<T> = T extends object ? {
    readonly [P in keyof T]: DeepReadonly<T[P]>
  } : T;
}

{
  // https://github.com/type-challenges/type-challenges/blob/master/questions/10-medium-tuple-to-union/README.md
  type Arr = ['1', '2', '3']

  type Test = TupleToUnion<Arr> // expected to be '1' | '2' | '3'
  type TupleToUnion<T extends any[]> = T extends [infer F, ...infer B] ? F | TupleToUnion<B> : never;
}

{
  // https://github.com/type-challenges/type-challenges/blob/master/questions/12-medium-chainable-options/README.md
  const config: Chainable<{}> = {} as any;
  
  const result = config
    .option('foo', 123)
    .option('name', 'type-challenges')
    .option('bar', { value: 'Hello World' })
    .get()

  // expect the type of result to be:
  interface Result {
    foo: number
    name: string
    bar: {
      value: string
    }
  }

  type Chainable<T extends object = {}> = {
    option<K extends string, V>(k: K, v: V): Chainable<T & {[P in K]: V}>;
    get(): T;
  };
}