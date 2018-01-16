/* eslint require-jsdoc: 'error', valid-jsdoc: 'error' */
import ScaleContinuous, { deInterpolateLinear, copyScale } from './continuous'
import ticks, { tickIncrement } from '../utils/array/ticks'
import interpolateNumber from '../utils/interpolators/number'
/**
 * Scale linear class
 */
class ScaleLinear extends ScaleContinuous {
  /**
   * this constructs a linear scale with linear deinterpolator and a numeric interpolator
   */
  constructor () {
    super(deInterpolateLinear, interpolateNumber)
  }

  /**
   * Returns approximately count uniformly spaced values from the scale's domain. Note
   * that the specified count is only a hint, the scale may return more or fewer values
   * than count depending on the domain.
   *
   * @param {number} [count=7] The approoximate number of ticks to generate. Defaults to 7.
   * @return {Array} An array of generated tick values
   */
  ticks (count = 7) {
    const domain = this.getDomain()

    return ticks(domain[0], domain[domain.length - 1], count)
  }

  /**
   * Extends the domain so that it starts and ends on nice, round values. The optional count
   * parameter allows greater control over the step size.
   * Note: Nicing the domain ony affects the current domain. The scale must be re-niced after
   * setting a new domain, if required.
   *
   * @param {number} [count=7] Optional argument which allows control over the step size used to
   *                           extend the bound, guaranteeing that the returned ticks will exactly
   *                           cover the domain.
   * @return {Object} An instance of the scale.
   */
  nice (count = 7) {
    let domain = this.getDomain()
    let startIndex = 0
    let endIndex = domain.length - 1
    let start = domain[startIndex]
    let stop = domain[endIndex]
    let step

    if (stop < start) {
      step = start
      start = stop
      stop = step

      step = startIndex
      startIndex = endIndex
      endIndex = step
    }

    step = tickIncrement(start, stop, count)

    if (step > 0) {
      start = Math.floor(start / step) * step
      stop = Math.ceil(stop / step) * step
      step = tickIncrement(start, stop, count)
    } else if (step < 0) {
      start = Math.ceil(start * step) / step
      stop = Math.floor(stop * step) / step
      step = tickIncrement(start, stop, count)
    }

    if (step > 0) {
      domain[startIndex] = Math.floor(start / step) * step
      domain[endIndex] = Math.ceil(stop / step) * step
      this.setDomain(domain)
    } else if (step < 0) {
      domain[startIndex] = Math.ceil(start * step) / step
      domain[endIndex] = Math.floor(stop * step) / step
      this.setDomain(domain)
    }

    return this
  }

  /**
   * creates a new copy of the scale with configiration of the current scale
   * @return {Object} instance of new scale
   */
  copy () {
    return copyScale(this, new ScaleLinear())
  }
}
export default ScaleLinear
