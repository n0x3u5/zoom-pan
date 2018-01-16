import interpolateValue from '../utils/interpolators/value'
import interpolateRound from '../utils/interpolators/round'
import constant from '../utils/constant'
const UNIT = [0, 1]

/**
 * Returns a function which when given a value in domain returns the corresponding range
 * @param {Array} domain array containing the start and end value
 * @param {Array} range array containing the start and end value
 * @param {Function} deInterpolate function
 * @param {Function} reInterpolate function
 * @return {Function} takes in value and returns the mapped value
 */
function bimap (domain, range, deInterpolate, reInterpolate) {
  var deInterpolator,
    reInterpolator
  if (domain[0] > domain[1]) {
    deInterpolator = deInterpolate(domain[1], domain[0])
    reInterpolator = reInterpolate(range[1], range[0])
  } else {
    deInterpolator = deInterpolate(domain[0], domain[1])
    reInterpolator = reInterpolate(range[0], range[1])
  }
  return value => reInterpolator(deInterpolator(value))
}
/**
 * copy the domain, range and interpolator of source to targe
 * @param {Object} sourceScale instance of scale
 * @param {Object} targetScale instance of scale
 * @return {Object} the target scale
 */
function copyScale (sourceScale, targetScale) {
  return targetScale.setInterpolate(sourceScale.getInterpolate())
    .setClamp(sourceScale.getClamp())
    .setDomain(sourceScale.getDomain())
    .setRange(sourceScale.getRange())
}
/**
 * function to return a ratio with respect to the liinterpolatemit
 * @param {number} min of domain
 * @param {number} max of domain
 * @return {Function} that takes in value and return the ratio
 */
function deInterpolateLinear (min, max) {
  min = Number(min)
  max = Number(max)

  let diff = max - min
  if (!diff) {
    return constant(diff)
  }

  return value => ((value - min) / diff)
}
/**
 * function to return a ratio with respect to the limit and will clamp it to 0 and 1
 * if it goes out of range
 * @param {Function} deInterpolate function
 * @return {Function} takes a value and return clamped value
 */
function deInterpolateClamp (deInterpolate) {
  return (min, max) => {
    min = Number(min)
    max = Number(max)
    var interpolator = deInterpolate(min, max)
    return value => {
      if (value <= min) {
        return 0
      } else if (value >= max) {
        return 1
      } else {
        return interpolator(value)
      }
    }
  }
}
/**
 * function to return a value with respect to the limit and will clamp it to max and min
 * if it goes out of range
 * @param {Function} reInterpolate function
 * @return {Function} takes in ratio and returns clamped value
 */
function reInterpolateClamp (reInterpolate) {
  return (min, max) => {
    min = Number(min)
    max = Number(max)
    var interpolator = reInterpolate(min, max)
    return ratio => {
      if (ratio <= 0) {
        return min
      } else if (ratio >= 1) {
        return max
      } else {
        return interpolator(ratio)
      }
    }
  }
}
/**
 * continous scale class
 */
class ScaleContinuous {
  /**
   * constructs the class with
   * @param {Function} deInterpolate deinterpolate(a,b)(x) takes a domain value x in [a,b] and returns
   * corresponding value t in [0,1]
   * @param {Function} reInterpolate reinterpolate(a,b)(t) takes a value t in [0,1] and returns
   * corresponding domain value x in [a,b]
   */
  constructor (deInterpolate, reInterpolate) {
    this.domain = UNIT
    this.range = UNIT
    this.deInterpolate = deInterpolate
    this.reInterpolate = reInterpolate
    this.interpolate = interpolateValue
    this.clamp = false
    this.input = null
    this.output = null
    this._rescale()
  }
  /**
   * when called it informs the scale that it needs to update its mappiing function
   * @return {Object} instnace of
   */
  _rescale () {
    this.input = null
    this.output = null
    return this
  }
  /**
   * sets the domain
   * @param {Array} inputArr is the input array contianig the domian
   * @return {Object} instance of scale
   */
  setDomain (inputArr = UNIT) {
    this.domain = inputArr.map(Number)
    return this._rescale()
  }
  /**
   * returns the currnet domain
   * @return {Array} domain array
   */
  getDomain () {
    return this.domain.slice()
  }
  /**
   * sets the range
   * @param {Array} inputArr is the input array contianig the range
   * @return {Object} instance of scale
   */
  setRange (inputArr = UNIT) {
    this.range = inputArr.slice()
    return this._rescale()
  }
  /**
   * returns the currnet range
   * @return {Array} range array
   */
  getRange () {
    return this.range.slice()
  }
  /**
   * sets the inpterpolate function
   * @param {Function} interpolate function
   * @return {Object} instance of scale
   */
  setInterpolate (interpolate = interpolateValue) {
    this.interpolate = interpolate
    return this._rescale()
  }
  /**
   * get the interpolate function
   * @return {Function} interpolate function
   */
  getInterpolate () {
    return this.interpolate
  }
  /**
   * Function to set if the value returned will be clamped to the domain or range
   * @param {boolean} clamp is the flag to check wether to clamp the value to the given range
   * @return {Object} instance of scale
   */
  setClamp (clamp = false) {
    this.clamp = !!clamp
    return this._rescale()
  }
  /**
   * returns the clamping value
   * @return {boolean} clamp flag value
   */
  getClamp () {
    return this.clamp
  }
  /**
   * sets the new range and sets the interpolate function as round interpolate
   * @param {Array} inputArr of range
   * @return {Object} instance of scale
   */
  rangeRound (inputArr = UNIT) {
    this.range = inputArr.slice()
    this.interpolate = interpolateRound
    return this._rescale()
  }
  /**
   * Function to return the range value with respect to domain value
   * @param {number} domainValue is a domain value
   * @return {number} range value
   */
  getRangeValue (domainValue) {
    let clamp = this.getClamp()
    let deInterpolate = clamp ? deInterpolateClamp(this.deInterpolate) : this.deInterpolate
    if (!this.output) {
      this.output = bimap(this.getDomain(), this.getRange(), deInterpolate, this.interpolate)
    }
    return this.output(Number(domainValue))
  }
  /**
   * Function to return the domain value with respect to range value
   * @param {number} rangeValue is the pixel value
   * @return {number} domain value
   */
  getDomainValue (rangeValue) {
    let clamp = this.getClamp()
    let reInterpolate = clamp ? reInterpolateClamp(this.reInterpolate) : this.reInterpolate
    if (!this.input) {
      this.input = bimap(this.getRange(), this.getDomain(), deInterpolateLinear, reInterpolate)
    }
    return this.input(Number(rangeValue))
  }
}

export { copyScale, deInterpolateLinear }
export default ScaleContinuous
