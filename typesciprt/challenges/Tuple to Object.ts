// https://github.com/type-challenges/type-challenges/blob/master/questions/11-easy-tuple-to-object/README.md

const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const;

type result = TupleToObject<typeof tuple>; // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}

type TupleToObject<T extends readonly any[]> = {[P in T[number]]: P};
