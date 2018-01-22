import DiscontinuityRange from '../range'

describe('DiscontinuityRange', () => {
  describe('#clampUp', () => {
    test('should do nothing if no ranges are provided', () => {
      expect(new DiscontinuityRange().clampUp(10)).toBe(10)
    })

    test('should clamp up if the number falls within a discontinuity', () => {
      expect(new DiscontinuityRange([0, 10]).clampUp(5)).toBe(10)
      expect(new DiscontinuityRange([0, 10], [20, 30]).clampUp(25)).toBe(30)
      expect(new DiscontinuityRange([-10, 10], [20, 30]).clampUp(0)).toBe(10)
    })

    test('should not clamp up at the boundary of a discontinuity', () => {
      expect(new DiscontinuityRange([0, 10]).clampUp(0)).toBe(0)
    })
  })

  describe('#clampDown', () => {
    test('should do nothing if no ranges are provided', () => {
      expect(new DiscontinuityRange().clampDown(10)).toBe(10)
    })

    test('should clamp down if the number falls within a discontinuity', () => {
      expect(new DiscontinuityRange([0, 10]).clampDown(5)).toBe(0)
      expect(new DiscontinuityRange([0, 10], [20, 30]).clampDown(25)).toBe(20)
      expect(new DiscontinuityRange([-10, 10], [20, 30]).clampDown(0)).toBe(-10)
    })

    test('should not clamp down at the boundary of a discontinuity', () => {
      expect(new DiscontinuityRange([0, 10]).clampDown(10)).toBe(10)
    })
  })

  describe('#distance', () => {
    test('should do nothing if no ranges are provided', () => {
      expect(new DiscontinuityRange().distance(10, 20)).toBe(10)
    })

    test('should remove discontinuities', () => {
      expect(new DiscontinuityRange([0, 10]).distance(0, 20)).toBe(10)
      expect(new DiscontinuityRange([0, 10]).distance(5, 20)).toBe(10)
      expect(new DiscontinuityRange([0, 10], [10, 20]).distance(0, 30)).toBe(10)
      expect(new DiscontinuityRange([0, 10], [20, 30]).distance(0, 30)).toBe(10)
    })
  })

  describe('#offset', () => {
    test('should simply offset if no ranges are provided', () => {
      expect(new DiscontinuityRange().offset(10, 5)).toBe(15)
      expect(new DiscontinuityRange().offset(-10, 50)).toBe(40)
      expect(new DiscontinuityRange().offset(10, -5)).toBe(5)
    })

    test('should offset with discontinuities', () => {
      // before discontinuity
      expect(new DiscontinuityRange([5, 10]).offset(4, 2)).toBe(11)
      // within discontinuity
      expect(new DiscontinuityRange([5, 10]).offset(7, 2)).toBe(12)
      // after discontinuity
      expect(new DiscontinuityRange([5, 10]).offset(17, 2)).toBe(19)
      // multiple discontinuities
      expect(new DiscontinuityRange([5, 10], [20, 30]).offset(0, 40)).toBe(55)
    })

    test('should allow negative offsets with discontinuities', () => {
      // before discontinuity
      expect(new DiscontinuityRange([5, 10]).offset(11, -2)).toBe(4)
      // within discontinuity
      expect(new DiscontinuityRange([5, 10]).offset(7, -2)).toBe(3)
      // after discontinuity
      expect(new DiscontinuityRange([5, 10]).offset(2, -2)).toBe(0)
      // multiple discontinuities
      expect(new DiscontinuityRange([5, 10], [20, 30]).offset(55, -40)).toBe(0)
    })
  })

  test('#copy', () => {
    const original = new DiscontinuityRange([5, 10], [20, 30])
    expect(original.offset(0, 40)).toBe(55)

    const copy = original.copy()
    expect(copy.offset(0, 40)).toBe(55)
  })

  test('should support dates', () => {
    const start = new Date(2015, 0, 9)
    const end = new Date(2015, 0, 10)
    const range = new DiscontinuityRange([start, end])

    expect(range.distance(new Date(2015, 0, 8), new Date(2015, 0, 11))).toBe(24 * 3600 * 1000 * 2)
    expect(range.offset(new Date(2015, 0, 8), 24 * 3600 * 1000 * 2)).toEqual(new Date(2015, 0, 11))
  })
})
