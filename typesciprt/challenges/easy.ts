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