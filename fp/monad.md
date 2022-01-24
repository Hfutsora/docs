
# FP(Functional Programming)


## 纯函数  pure

> 即相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用。 f(x) => b

```JS
slice [1, 2, 3] => [2, 3] // pure

splice [1] => [2, 3] // side effect
```

## 柯里化 curry

> 只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

```js
var add = function(x) {
  return function(y) {
    return x + y;
  };
}; 
```

### Monad 一个自函子范畴上的幺半群

#### Unit, pure, of 一元运算符

```js
unit(a) => Ma // 将一个底层数据封装为 Monad
```

#### Bind, Chain, FlatMap 连接符

```js
bind(Ma, f) => Mu // 从 Monad 中取出数据，并将其放入接受这一数据并返回 Monad 的函数中
```

### Functor 函子 

函子即所谓的 Functor，是一个能把值装在里面，通过传入函数来变换容器内容的容器

而自函子则是【能把范畴映射到本身】的 Functor

Monad 本质是一种容器，在类似数字、字符串、布尔值 等数据的表达能力欠缺的情况下可以对其进行增强。

```ts
class Functor {
  constructor (value) {
    this.value = value ;
  }      
  map (fn: Function) {
    return Functor.of(fn(this.value))
  }
}
Functor.of = function (val) {
  return new Functor(val);
}

Functor.of(5).map(add).map(double) // chain
```



### Monoid 幺半群

- 单位元

```js
作用到单位元 unit(a) 上的 f，结果和 f(a) 一致

Ma.map(f) == f(a)
```

- 结合律

```js
作用到非单位元 m 上的 unit，结果还是 m 本身

// (f ∘ g) ∘ h = f ∘ (g ∘ h)
Ma.map(f).map(g) == Ma.map(x => f(x).map(g))
```

#### Either Monad

```js
class Left {
  static of (value) {
    return new Left(value)
  }

  constructor (value) {
    this._value = value
  }

  map (fn) {
    return this
  }
}

class Right {
  static of (value) {
    return new Right(value)
  }

  constructor (value) {
    this._value = value
  }

  map (fn) {
    return Right.of(this._value)
  }
}
```

#### Maybe Monad

```JS
class Maybe {
  static just (value) {
    return new Maybe(value)
  }
    
  static nothing() {
     return new Maybe(null)
  }

  constructor (value) {
    this._value = value
  }

  map (fn) {
    // 检查自己的值是否为空
    return this._value ? Maybe.just(fn(this._value)) : Maybe.nothing()
  }
}
```

## 声明式、命令式

```js
// 命令式
var makes = [];
for (i = 0; i < cars.length; i++) {
  makes.push(cars[i].make);
}

// 声明式
var makes = cars.map(function(car){ return car.make; });
```

## Monad Example

```typescript
interface Expr {
  type: 'value' | 'division';
  value: number | DivisionExpr;
}

const a = { value: 1, type: 'value' };
const b = { value: 'division', { left: { value: 1, type: 'value' }, right: { value: 1, type: 'value' } } }
// a / ( c / d )

interface DivisionExpr {
   left: number;
   right: number;
}

function division(e: Expr): number {
  if (e.type === 'value') return e.value;

  const left = division(e.value.left);
  const right = division(e.value.right);
  if (right === 0) throw new Error('The divisor is zero.'); // NaN

  return left / right;
}
```

```typescript
// use Maybe
function safeDiv(x: number, y: number): Maybe {
  if (y === 0) return Maybe.nothing();
  return Maybe.just(x / y);
}

function division(e: Expr): Maybe {
  if (e.type === 'value') return Maybe.just(e.value);

  const left = division(e.value.left);
  if (left.isNothing()) {
    return Maybe.nothing();
  } else {
    const right = division(e.value.right);
    if (right.isNothing()) {
      return Maybe.nothing();
    } else {
      return safeDiv(left.value, right.value);
    }
  }
}
```

```typescript

// monad division
function division(e: Expr): number {
  if (e.type === 'value') return Maybe.just(e.value);

  return division(e.value.left)
    .bind(left => division(e.value.right
      .bind(right => safeDiv(left, right));
}
```