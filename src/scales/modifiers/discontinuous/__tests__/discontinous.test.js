import ScaleLinear from '../../../linear'
import Discontinuous from '../discontinuous'
import DiscontinuityRange from '../discontinuity/range'

describe('A discontinuous scale', () => {
  test('should default to being an identity scale', () => {
    const scale = new Discontinuous()

    expect(scale.getRangeValue(0)).toBe(0)
    expect(scale.getRangeValue(10)).toBe(10)

    expect(scale.getDomainValue(0)).toBe(0)
    expect(scale.getDomainValue(10)).toBe(10)
  })

  test('should support copy', () => {
    const start = new Date(2015, 0, 8) // thursday
    const end = new Date(2015, 0, 15) // thursday

    const scale = new Discontinuous(new ScaleLinear())
      .setDiscontinuity(new DiscontinuityRange())
      .setRange([0, 100])
      .setDomain([start, end])

    const clone = scale.copy()

    expect(clone.getDiscontinuity()).toEqual(scale.getDiscontinuity())
    expect(clone.getRange()[0]).toBe(0)
    expect(clone.getRange()[1]).toBe(100)
    expect(clone.getDomain()[0]).toEqual(+start)
    expect(clone.getDomain()[1]).toEqual(+end)
  })

  describe('ticks', () => {
    test('should ensure that they are not within discontinuities', () => {
      const scale = new Discontinuous(new ScaleLinear())
        .setDiscontinuity(new DiscontinuityRange([5, 20]))
        .setDomain([0, 25])

      const ticksInDiscontinuityRange = scale.ticks()
        .filter(tick => tick > 5 && tick < 20)
      expect(ticksInDiscontinuityRange).toEqual([])
    })

    test('should support arguments being passed to it', () => {
      const start = new Date(2015, 0, 9) // friday
      const end = new Date(2015, 0, 12) // monday

      const scale = new Discontinuous(new ScaleLinear())
        .setDiscontinuity(new DiscontinuityRange([5, 20]))
        .setDomain([start, end])

      expect(scale.ticks(100).length).toEqual(130)
    })
  })

  describe('without discontinuities', () => {
    const range = [0, 100]
    const start = 10
    const end = 60

    const referenceScale = new ScaleLinear()
      .setDomain([start, end])
      .setRange(range)

    const scale = new Discontinuous(new ScaleLinear())
      .setDomain([start, end])
      .setRange(range)

    it('should match the scaling of a regular linear scale', () => {
      expect(scale.getRangeValue(20)).toEqual(referenceScale.getRangeValue(20))
      expect(scale.getRangeValue(50)).toEqual(referenceScale.getRangeValue(50))

      expect(scale.getRangeValue(start)).toEqual(referenceScale.getRangeValue(start))
      expect(scale.getRangeValue(end)).toEqual(referenceScale.getRangeValue(end))
    })

    it('should match the inverse scaling of a regular linear scale', () => {
      expect(scale.getDomainValue(0)).toEqual(referenceScale.getDomainValue(0))
      expect(scale.getDomainValue(50)).toEqual(referenceScale.getDomainValue(50))
      expect(scale.getDomainValue(100)).toEqual(referenceScale.getDomainValue(100))
    })
  })

  describe('with discontinuities', () => {
    it('should scale correctly', () => {
      const scale = new Discontinuous(new ScaleLinear())
        .setDiscontinuity(new DiscontinuityRange([40, 90]))
        .setDomain([0, 100])
        .setRange([0, 100])

      expect(scale.getRangeValue(10)).toEqual(20)
    })
  })

  describe('domain', () => {
    const endOfWeek = new Date(2015, 0, 25, 12) // saturday 00:00 hours
    const end = new Date(2015, 0, 25, 12) // sunday noon

    const startOfWeek = new Date(2015, 0, 18, 12) // monday 00:00 hours
    const start = new Date(2015, 0, 18, 12) // sunday noon

    it('should clamp the supplied values', () => {
      const dateTime = new Discontinuous(new ScaleLinear())
        .setDiscontinuity(new DiscontinuityRange())
        .setDomain([start, end])

      expect(dateTime.getDomain()[0]).toEqual(+startOfWeek)
      expect(dateTime.getDomain()[1]).toEqual(+endOfWeek)
    })
  })

  describe('nice', () => {
    it('should clamp the resulting domain', () => {
      var scale = new Discontinuous(new ScaleLinear())
        .setDiscontinuity(new DiscontinuityRange([-0.1, 0.1], [9.9, 10.1]))
        .setDomain([0.2, 9.8])

      // A regular linear scale would 'nice' to [0, 10], however, both
      // these values fall within discontinuities - so they are clamped
      scale.nice()

      expect(scale.getDomain()[0]).toBe(0.1)
      expect(scale.getDomain()[1]).toBe(9.9)
    })
  })
})
