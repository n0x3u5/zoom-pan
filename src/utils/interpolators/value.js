import interpolateNumber from './number'
import constant from '../constant'

function isValid (num) {
  if (num === null || typeof num === 'undefined') {
    return false
  }
  return true
}

function interpolateValue (from, to) {
  const interpolator = interpolateNumber

  if (!isValid(to) || !isValid(from) || typeof to === 'boolean') {
    return constant(to)
  }

  return interpolator(from, to)
}

export default interpolateValue
