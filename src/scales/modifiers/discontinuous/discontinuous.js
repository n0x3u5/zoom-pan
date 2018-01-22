import ScaleIdentity from '../../identity'
import Identity from './discontinuity/identity'
import tickFilter from './tickFilter'

class ScaleDiscontinuous {
  constructor (scale) {
    this.scale = scale || new ScaleIdentity()
    this.discontinuity = new Identity()

    this.setRange = function (...params) {
      this.scale.setRange(...params)
      return this
    }
    this.getRange = function () {
      return this.scale.getRange()
    }

    if (this.scale.rangeRound) {
      this.rangeRound = function (...params) {
        this.scale.rangeRound(...params)
        return this
      }
    }

    if (this.scale.setInterpolate) {
      this.setInterpolate = function (...params) {
        this.scale.setInterpolate(...params)
        return this
      }
      this.getInterpolate = function () {
        return this.scale.getInterpolate()
      }
    }

    if (this.scale.setClamp) {
      this.setClamp = function (...params) {
        this.scale.setClamp(...params)
        return this
      }
      this.getClamp = function () {
        this.scale.getClamp()
      }
    }
  }

  setDomain (domain) {
    let domainLower = this.discontinuity.clampUp(domain[0])
    let domainUpper = this.discontinuity.clampDown(domain[1])

    this.scale.setDomain([domainLower, domainUpper])

    return this
  }

  getDomain () {
    return this.scale.getDomain()
  }

  setDiscontinuity (discontinuity) {
    this.discontinuity = discontinuity

    return this
  }

  getDiscontinuity () {
    return this.discontinuity
  }

  getRangeValue (domainValue) {
    const domain = this.scale.getDomain()
    const range = this.scale.getRange()
    const domainDistance = this.discontinuity.distance(domain[0], domain[1])
    const distanceToValue = this.discontinuity.distance(domain[0], domainValue)
    const ratioToValue = distanceToValue / domainDistance

    return (ratioToValue * (range[1] - range[0])) + range[0]
  }

  getDomainValue (rangeValue) {
    const domain = this.scale.getDomain()
    const range = this.scale.getRange()
    const domainDistance = this.discontinuity.distance(domain[0], domain[1])
    const ratioToValue = (rangeValue - range[0]) / (range[1] - range[0])
    const distanceToValue = ratioToValue * domainDistance

    return this.discontinuity.offset(domain[0], distanceToValue)
  }

  ticks (count) {
    let ticks = this.scale.ticks(count)

    return tickFilter(ticks, this.discontinuity)
  }

  nice (count) {
    this.scale.nice(count)

    const domain = this.scale.getDomain()
    const domainLower = this.discontinuity.clampUp(domain[0])
    const domainUpper = this.discontinuity.clampDown(domain[1])

    this.scale.setDomain([domainLower, domainUpper])

    return this
  }

  copy () {
    return new ScaleDiscontinuous(this.scale.copy())
      .setDiscontinuity(this.discontinuity.copy())
  }
}

export default ScaleDiscontinuous
