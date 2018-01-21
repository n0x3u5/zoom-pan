import number from '../utils/number'
import ticks, { tickIncrement } from '../utils/array/ticks'

class ScaleIdentity {
  constructor () {
    this.domain = [0, 1]
  }

  setDomain (domain) {
    this.domain = domain.map(number)
    return this
  }

  getDomain () {
    return this.domain.slice()
  }

  setRange (range) {
    this.domain = range.map(number)
    return this
  }

  getRange () {
    return this.domain.slice()
  }

  getRangeValue (domainValue) {
    return +domainValue
  }

  getDomainValue (rangeValue) {
    return +rangeValue
  }

  // TODO: Use a mixin from linear to add the ticks and nice methods instead of redefining them here
  ticks (count = 7) {
    const domain = this.getDomain()

    return ticks(domain[0], domain[domain.length - 1], count)
  }

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

  copy () {
    return new ScaleIdentity().setDomain(this.getDomain())
  }
}

export default ScaleIdentity
