// https://github.com/type-challenges/type-challenges/blob/master/questions/11-easy-tuple-to-object/README.md
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const;

type result = TupleToObject<typeof tuple>; // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}

type TupleToObject<T extends readonly any[]> = {[P in T[number]]: P};


// https://github.com/type-challenges/type-challenges/blob/master/questions/14-easy-first/README.md
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3

type First<T extends any[]> =  T['length'] extends 0 ? never : T[0];

// https://github.com/type-challenges/type-challenges/blob/master/questions/43-easy-exclude/README.md
type MyExclude<T,  D> = T extends D ? T : never;

type excludedA = MyExclude<'a' | 'b', 'a'>

// https://github.com/type-challenges/type-challenges/blob/master/questions/189-easy-awaited/README.md
// Awaited
// If we have a type which is wrapped type like Promise. How we can get a type which is inside the wrapped type? For example if we have Promise<ExampleType> how to get ExampleType?

type GetPromsie<T> = T extends Promise<infer R> ? R : T;
type GetA = GetPromsie<Promise<string>>;
type Getb = GetPromsie<number>;

// https://github.com/type-challenges/type-challenges/blob/master/questions/268-easy-if/README.md
type A = If<true, 'a', 'b'>  // expected to be 'a'
type B = If<false, 'a', 'b'> // expected to be 'b'

type If<B extends boolean, T, D> = B extends true ? T : D;

// https://github.com/type-challenges/type-challenges/blob/master/questions/533-easy-concat/README.md
type Result = Concat<[1], [2]> // expected to be [1, 2]

type Concat<T extends any[], D extends any[]> = [...T, ...D];

https://github.com/type-challenges/type-challenges/blob/master/questions/898-easy-includes/README.md
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
type Includes<T extends any[], D> =  D extends T[number] ? true : false;

// https://github.com/type-challenges/type-challenges/blob/master/questions/3312-easy-parameters/README.md

type MyParameters<T extends Function> = T extends (...args: infer R) => unknown ? R : never;
type p = MyParameters<(a: number, b: string) => void>;
type p2 = MyParameters<() => void>;