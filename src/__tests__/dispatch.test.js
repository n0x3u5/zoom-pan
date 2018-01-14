import Dispatcher from '../dispatcher'

describe('new Dispatcher(type...)', () => {
  test('does not throw an error if a specified type name collides with a dispatch method', () => {
    const d = new Dispatcher('on')

    expect(d).toBeInstanceOf(Dispatcher)
  })

  test('throws an error if a specified type name is illegal', () => {
    expect(() => new Dispatcher('__proto__')).toThrow(Error)
    expect(() => new Dispatcher('hasOwnProperty')).toThrow(Error)
    expect(() => new Dispatcher('')).toThrow(Error)
  })

  test('throws an error if a specified type name is a duplicate', () => {
    expect(() => new Dispatcher('foo', 'foo')).toThrow(Error)
  })
})

describe('new Dispatcher(type...).dispatch(type, object, arguments)', () => {
  test('invokes callbacks of the specified type', () => {
    let foo = 0
    let bar = 0
    const d = new Dispatcher('foo', 'bar').on('foo', () => ++foo).on('bar', () => ++bar)

    d.dispatch('foo')
    expect(foo).toBe(1)
    expect(bar).toBe(0)

    d.dispatch('foo')
    d.dispatch('bar')
    expect(foo).toBe(2)
    expect(bar).toBe(1)
  })

  test('invokes callbacks with specified arguments and context', () => {
    const results = []
    const foo = {}
    const bar = {}
    const d = new Dispatcher('foo').on('foo', function () {
      results.push({ this: this, arguments: [].slice.call(arguments) })
    })

    d.dispatch('foo', foo, [bar])
    expect(results).toEqual([{ this: foo, arguments: [bar] }])
    d.dispatch('foo', bar, [foo, 42, 'baz'])
    expect(results).toEqual([{ this: foo, arguments: [bar] }, { this: bar, arguments: [foo, 42, 'baz'] }])
  })

  test('invokes callbacks in the order they were added', () => {
    const results = []
    const d = new Dispatcher('foo')

    d.on('foo.a', () => results.push('A'))
    d.on('foo.b', () => results.push('B'))
    d.dispatch('foo')

    d.on('foo.c', () => results.push('C'))
    d.on('foo.a', () => results.push('A')) // move to end
    d.dispatch('foo')

    expect(results).toEqual(['A', 'B', 'B', 'C', 'A'])
  })

  test('returns undefined', () => {
    const d = new Dispatcher('foo')

    expect(d.dispatch('foo')).toBeUndefined()
  })
})

describe('new Dispatcher(type).on(type, f)', () => {
  test('returns the Dispatcher object', () => {
    const d = new Dispatcher('foo')

    expect(d.on('foo', () => {})).toEqual(d)
  })

  test('replaces an existing callback, if present', () => {
    let foo = 0
    let bar = 0
    const d = new Dispatcher('foo', 'bar')

    d.on('foo', () => ++foo)
    d.dispatch('foo')
    expect(foo).toBe(1)
    expect(bar).toBe(0)

    d.on('foo', () => ++bar)
    d.dispatch('foo')
    expect(foo).toBe(1)
    expect(bar).toBe(1)
  })

  test('has no effect when replacing an existing callback with itself', () => {
    let foo = 0
    const fooFun = () => ++foo
    const d = new Dispatcher('foo').on('foo', fooFun)

    d.dispatch('foo')
    expect(foo).toBe(1)

    d.on('foo', fooFun).on('foo', fooFun).on('foo', fooFun)
    d.dispatch('foo')

    expect(foo).toBe(2)
  })

  test('does not invoke the old or the new callback during a callback', () => {
    let a = 0
    let b = 0
    let c = 0
    const funA = () => {
      ++a
      d.on('foo.B', funC) // replace B with C
    }
    const funB = () => ++b
    const funC = () => ++c
    const d = new Dispatcher('foo').on('foo.A', funA).on('foo.B', funB)

    d.dispatch('foo')
    expect(a).toBe(1)
    expect(b).toBe(0)
    expect(c).toBe(0)
  })

  test('does not invoke the new callback during a callback', () => {
    let a = 0
    let b = 0
    const funA = () => {
      ++a
      d.on('foo.B', funB) // add B
    }
    const funB = () => ++b
    const d = new Dispatcher('foo').on('foo.A', funA)

    d.dispatch('foo')

    expect(a).toBe(1)
    expect(b).toBe(0)
  })

  test('coerces type to a string', () => {
    const f = () => {}
    const g = () => {}
    const d = new Dispatcher(null, undefined).on(null, f).on(undefined, g)

    expect(d.on(null)).toEqual(f)
    expect(d.on(undefined)).toEqual(g)
  })

  test('throws an error if f is not a function', () => {
    expect(() => new Dispatcher('foo').on('foo', 42)).toThrow(Error)
  })
})

test('new Dispatcher(...).on(type, f) throws an error if the type is unknown', () => {
  expect(() => new Dispatcher('foo').on('bar', () => {})).toThrow(Error)
  expect(() => new Dispatcher('foo').on('__proto__', () => {})).toThrow(Error)
})

test('new Dispatcher(...).on(type) throws an error if the type is unknown', () => {
  expect(() => new Dispatcher('foo').on('bar')).toThrow(Error)
  expect(() => new Dispatcher('foo').on('__proto__')).toThrow(Error)
})

test('new Dispatcher(type).on(type., ...) is equivalent to new Dispatcher(type).on(type, ...)', () => {
  let foos = 0
  let bars = 0
  const d = new Dispatcher('foo')
  const foo = () => ++foos
  const bar = () => ++bars

  expect(d.on('foo.', foo)).toBe(d)
  expect(d.on('foo.')).toBe(foo)
  expect(d.on('foo')).toEqual(foo)
  expect(d.on('foo.', bar)).toBe(d)
  expect(d.on('foo.')).toBe(bar)
  expect(d.on('foo')).toBe(bar)
  expect(d.dispatch('foo')).toBeUndefined()
  expect(foos).toBe(0)
  expect(bars).toBe(1)

  expect(d.on('.', null)).toBe(d)
  expect(d.on('foo')).toBeUndefined()
  expect(d.dispatch('foo')).toBeUndefined()
  expect(foos).toBe(0)
  expect(bars).toBe(1)
})

describe('new Dispatcher(type).on(type, null)', () => {
  test('removes an existing callback if present', () => {
    let foo = 0
    const d = new Dispatcher('foo', 'bar')

    d.on('foo', () => ++foo)
    d.dispatch('foo')
    expect(foo).toBe(1)
    d.on('foo', null)
    d.dispatch('foo')
    expect(foo).toBe(1)
  })

  test('does not remove a shared callback', () => {
    let a = 0
    const aFun = () => ++a
    const d = new Dispatcher('foo', 'bar').on('foo', aFun).on('bar', aFun)

    d.dispatch('foo')
    d.dispatch('bar')
    expect(a).toBe(2)

    d.on('foo', null)
    d.dispatch('bar')
    expect(a).toBe(3)
  })

  test('has no effect when removing a missing callback', () => {
    let a = 0
    const aFun = () => ++a
    const d = new Dispatcher('foo')

    d.on('foo.a', null).on('foo', aFun).on('foo', null).on('foo', null)
    d.dispatch('foo')

    expect(a).toBe(0)
  })

  test('does not invoke the old callback durring a callback', () => {
    let a = 0
    let b = 0
    const A = () => {
      ++a
      d.on('foo.B', null) // remove B
    }
    const B = () => ++b
    const d = new Dispatcher('foo').on('foo.A', A).on('foo.B', B)

    d.dispatch('foo')
    expect(a).toBe(1)
    expect(b).toBe(0)
  })
})

test(`new Dispatcher('foo', 'bar').on('foo bar', f) adds a callback for both types`, () => {
  let foos = 0
  const foo = () => ++foos
  const d = new Dispatcher('foo', 'bar').on('foo bar', foo)

  expect(d.on('foo')).toBe(foo)
  expect(d.on('bar')).toBe(foo)

  d.dispatch('foo')
  expect(foos).toBe(1)

  d.dispatch('bar')
  expect(foos).toBe(2)
})

test(`new Dispatcher('foo').on('foo.one foo.two', f) adds a callback for both typenames`, () => {
  let foos = 0
  const foo = () => ++foos
  const d = new Dispatcher('foo').on('foo.one foo.two', foo)

  expect(d.on('foo.one')).toBe(foo)
  expect(d.on('foo.two')).toBe(foo)

  d.dispatch('foo')
  expect(foos).toBe(2)
})

test(`new Dispatcher('foo', 'bar').on('foo bar') returns the callback for either type`, () => {
  let foos = 0
  const foo = () => ++foos
  const d = new Dispatcher('foo', 'bar')

  d.on('foo', foo)
  expect(d.on('foo bar')).toBe(foo)
  expect(d.on('bar foo')).toBe(foo)

  d.on('foo', null).on('bar', foo)
  expect(d.on('foo bar')).toBe(foo)
  expect(d.on('bar foo')).toBe(foo)
})

test(`new Dispatcher('foo').on('foo.one foo.two') returns the callback for either typename`, () => {
  let foos = 0
  const foo = () => ++foos
  const d = new Dispatcher('foo')

  d.on('foo.one', foo)
  expect(d.on('foo.one foo.two')).toBe(foo)
  expect(d.on('foo.two foo.one')).toBe(foo)
  expect(d.on('foo foo.one')).toBe(foo)
  expect(d.on('foo.one foo')).toBe(foo)

  d.on('foo.one', null).on('foo.two', foo)
  expect(d.on('foo.one foo.two')).toBe(foo)
  expect(d.on('foo.two foo.one')).toBe(foo)
  expect(d.on('foo foo.two')).toBe(foo)
  expect(d.on('foo.two foo')).toBe(foo)
})

test(`nwe Dispatcher('foo').on('.one .two', null) removes the callback for either typename`, () => {
  let foos = 0
  const foo = () => ++foos
  const d = new Dispatcher('foo')

  d.on('foo.one', foo)
  d.on('foo.two', foo)
  d.on('foo.one foo.two', null)
  expect(d.on('foo.one')).toBeUndefined()
  expect(d.on('foo.two')).toBeUndefined()
})

test('new Dispatcher(type).on(type) returns the expected callback', () => {
  const d = new Dispatcher('foo')
  const funA = () => {}
  const funB = () => {}
  const funC = () => {}

  d.on('foo.a', funA).on('foo.b', funB).on('foo', funC)

  expect(d.on('foo.a')).toBe(funA)
  expect(d.on('foo.b')).toBe(funB)
  expect(d.on('foo')).toBe(funC)
})

test('new Dispatcher(type).on(.name) returns undefined when retrieving a callback', () => {
  const d = new Dispatcher('foo').on('foo.a', () => {})

  expect(d.on('.a')).toBeUndefined()
})

test('new Dispatcher(type).on(.name, null) removes all callbacks with the specified name', () => {
  const d = new Dispatcher('foo', 'bar')
  const a = {}
  const b = {}
  const c = {}
  const those = []
  const funA = () => those.push(a)
  const funB = () => those.push(b)
  const funC = () => those.push(c)

  d.on('foo.a', funA).on('bar.a', funB).on('foo', funC).on('.a', null)
  d.dispatch('foo')
  d.dispatch('bar')

  expect(those).toEqual([c])
})

test('new Dispatcher(type).on(.name, f) has no effect', () => {
  const d = new Dispatcher('foo', 'bar')
  const a = {}
  const b = {}
  const those = []
  const funA = () => those.push(a)
  const funB = () => those.push(b)

  d.on('.a', funA).on('foo.a', funB).on('bar', funB)
  d.dispatch('foo')
  d.dispatch('bar')

  expect(those).toEqual([b, b])
  expect(d.on('.a')).toBeUndefined()
})
