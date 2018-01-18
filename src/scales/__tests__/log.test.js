import ScaleLog from '../log'
import interpolate from '../../utils/interpolators/value'

test('new ScaleLog() has the expected defaults', () => {
  let s = new ScaleLog()
  expect(s.getDomain()).toEqual([1, 10])
  expect(s.getRange()).toEqual([0, 1])
  expect(s.getClamp()).toBeFalsy()
  expect(s.getBase()).toBe(10)
  expect(s.getInterpolate()).toEqual(interpolate)
  expect(s.getInterpolate()(3, 5)(0.5)).toBe(4)
  expect(s.getRangeValue(5)).toBeCloseTo(0.69897, 6)
  expect(s.getDomainValue(0.69897)).toBeCloseTo(5, 6)
  expect(s.getRangeValue(3.162278)).toBeCloseTo(0.5, 6)
  expect(s.getDomainValue(0.5)).toBeCloseTo(3.162278, 6)
})

describe('new ScaleLog().setDomain', () => {
  test('coerces values to numbers', () => {
    let s = new ScaleLog().setDomain([new Date(1990, 0, 1), new Date(1991, 0, 1)])
    expect(typeof s.getDomain()[0]).toBe('number')
    expect(typeof s.getDomain()[1]).toBe('number')
    expect(s.getRangeValue(new Date(1989, 9, 20))).toBeCloseTo(-0.2059871, 6)
    expect(s.getRangeValue(new Date(1990, 0, 1))).toBeCloseTo(0.0000000, 6)
    expect(s.getRangeValue(new Date(1990, 2, 15))).toBeCloseTo(0.2039385, 6)
    expect(s.getRangeValue(new Date(1990, 4, 27))).toBeCloseTo(0.4058695, 6)
    expect(s.getRangeValue(new Date(1991, 0, 1))).toBeCloseTo(1.0000000, 6)
    expect(s.getRangeValue(new Date(1991, 2, 15))).toBeCloseTo(1.1942797, 6)
    s.setDomain(['1', '10'])
    expect(typeof s.getDomain()[0]).toBe('number')
    expect(typeof s.getDomain()[1]).toBe('number')
    expect(s.getRangeValue(5)).toBeCloseTo(0.69897, 6)
    // eslint-disable-next-line
    s.setDomain([new Number(1), new Number(10)])
    expect(typeof s.getDomain()[0]).toBe('number')
    expect(typeof s.getDomain()[1]).toBe('number')
    expect(s.getRangeValue(5)).toBeCloseTo(0.69897, 6)
  })

  test('can take negative values', () => {
    let s = new ScaleLog().setDomain([-100, -1])
    expect(s.getRangeValue(-50)).toBeCloseTo(0.150515, 6)
  })

  test('preserves specified domain exactly, with no floating point error', () => {
    let s = new ScaleLog().setDomain([0.1, 1000])
    expect(s.getDomain()).toEqual([0.1, 1000])
  })
})

describe('new ScaleLog().setRange()', () => {
  test('does not coerce values to numbers', () => {
    let s = new ScaleLog().setRange(['0', '2'])
    expect(typeof s.getRange()[0]).toBe('string')
    expect(typeof s.getRange()[1]).toBe('string')
  })
})

describe('new ScaleLog().setClamp(true)', () => {
  test('clamps to the domain', () => {
    let s = new ScaleLog().setClamp(true)
    expect(s.getRangeValue(-1)).toBeCloseTo(0, 6)
    expect(s.getRangeValue(5)).toBeCloseTo(0.69897, 6)
    expect(s.getRangeValue(15)).toBeCloseTo(1, 6)
    s.setDomain([10, 1])
    expect(s.getRangeValue(-1)).toBeCloseTo(1, 6)
    expect(s.getRangeValue(5)).toBeCloseTo(0.30103, 6)
    expect(s.getRangeValue(15)).toBeCloseTo(0, 6)
  })

  test('clamps to the range', () => {
    let s = new ScaleLog().setClamp(true)
    expect(s.getDomainValue(-0.1)).toBeCloseTo(1, 6)
    expect(s.getDomainValue(0.69897)).toBeCloseTo(5, 6)
    expect(s.getDomainValue(1.5)).toBeCloseTo(10, 6)
    s.setDomain([10, 1])
    expect(s.getDomainValue(-0.1)).toBeCloseTo(10, 6)
    expect(s.getDomainValue(0.30103)).toBeCloseTo(5, 6)
    expect(s.getDomainValue(1.5)).toBeCloseTo(1, 6)
  })
})

describe('new ScaleLog().getRangeValue(x)', () => {
  test('maps a number x to a number y', () => {
    let s = new ScaleLog().setDomain([1, 2])
    expect(s.getRangeValue(0.5)).toBeCloseTo(-1.0000000, 6)
    expect(s.getRangeValue(1.0)).toBeCloseTo(0.0000000, 6)
    expect(s.getRangeValue(1.5)).toBeCloseTo(0.5849625, 6)
    expect(s.getRangeValue(2.0)).toBeCloseTo(1.0000000, 6)
    expect(s.getRangeValue(2.5)).toBeCloseTo(1.3219281, 6)
  })
})

describe('new ScaleLog().getDomainValue(y) maps a number y to a number ', () => {
  test('maps a number y to a number x', () => {
    let s = new ScaleLog().setDomain([1, 2])
    expect(s.getDomainValue(-1.0000000)).toBeCloseTo(0.5, 6)
    expect(s.getDomainValue(0.0000000)).toBeCloseTo(1.0, 6)
    expect(s.getDomainValue(0.5849625)).toBeCloseTo(1.5, 6)
    expect(s.getDomainValue(1.0000000)).toBeCloseTo(2.0, 6)
    expect(s.getDomainValue(1.3219281)).toBeCloseTo(2.5, 6)
  })
  test('coerces y to a number', () => {
    let s = new ScaleLog().setRange(['0', '2'])
    expect(s.getDomainValue('1')).toBeCloseTo(3.1622777, 6)

    s.setRange([new Date(1990, 0, 1), new Date(1991, 0, 1)])
    expect(s.getDomainValue(new Date(1990, 6, 2, 13))).toBeCloseTo(3.1631089, 6)

    s.setRange(['#000', '#fff'])
    expect(Number.isNaN(s.getDomainValue('#999'))).toBeTruthy()
  })
})

describe('new ScaleLog().copy()', () => {
  test('isolates changes to the domain', () => {
    let s = new ScaleLog()
    let sCopy = s.copy()

    s.setDomain([10, 100])
    expect(sCopy.getDomain()).toEqual([1, 10])
    expect(s.getRangeValue(10)).toBeCloseTo(0, 6)
    expect(sCopy.getRangeValue(1)).toBeCloseTo(0, 6)

    sCopy.setDomain([100, 1000])
    expect(s.getRangeValue(100)).toBeCloseTo(1, 6)
    expect(sCopy.getRangeValue(100)).toBeCloseTo(0, 6)
    expect(s.getDomain()).toEqual([10, 100])
    expect(sCopy.getDomain()).toEqual([100, 1000])
  })

  test('isolates changes to the range', () => {
    let s = new ScaleLog()
    let sCopy = s.copy()

    s.setRange([1, 2])
    expect(s.getDomainValue(1)).toBeCloseTo(1, 6)
    expect(sCopy.getDomainValue(1)).toBeCloseTo(10, 6)
    expect(sCopy.getRange()).toEqual([0, 1])

    sCopy.setRange([2, 3])
    expect(s.getDomainValue(2)).toBeCloseTo(10, 6)
    expect(sCopy.getDomainValue(2)).toBeCloseTo(1, 6)
    expect(s.getRange()).toEqual([1, 2])
    expect(sCopy.getRange()).toEqual([2, 3])
  })

  test('isolates changes to clamping', () => {
    let s = new ScaleLog().setClamp(true)
    let sCopy = s.copy()

    s.setClamp(false)
    expect(s.getRangeValue(0.5)).toBeCloseTo(-0.30103, 6)
    expect(sCopy.getRangeValue(0.5)).toBeCloseTo(0, 6)
    expect(sCopy.getClamp()).toBeTruthy()

    sCopy.setClamp(false)
    expect(s.getRangeValue(20)).toBeCloseTo(1.30103, 6)
    expect(sCopy.getRangeValue(20)).toBeCloseTo(1.30103, 6)
    expect(s.getClamp()).toBeFalsy()
  })
})
