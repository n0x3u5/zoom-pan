const inRange = (number, range) => number > range[0] && number < range[1]
const surroundsRange = (inner, outer) => inner[0] >= outer[0] && inner[1] <= outer[1]
const add = (value, offset) => value instanceof Date ? new Date(value.getTime() + offset) : value + offset

class Range {
  constructor (...ranges) {
    this.ranges = ranges
  }

  distance (start, end) {
    start = this.clampUp(start)
    end = this.clampUp(end)

    const surroundedRanges = this.ranges.filter(range => surroundsRange(range, [start, end]))
    const rangeSizes = surroundedRanges.map(range => range[1] - range[0])

    return end - start - rangeSizes.reduce((total, current) => total + current, 0)
  }

  offset (start, offset) {
    if (offset > 0) {
      let currentLocation = this.clampUp(start)
      let offsetRemaining = offset

      while (offsetRemaining > 0) {
        const futureRanges = this.ranges.filter(r => r[0] > currentLocation).sort((a, b) => a[0] - b[0])

        if (futureRanges.length) {
          const nextRange = futureRanges[0]
          const delta = nextRange[0] - currentLocation

          if (delta > offsetRemaining) {
            currentLocation = add(currentLocation, offsetRemaining)
            offsetRemaining = 0
          } else {
            currentLocation = nextRange[1]
            offsetRemaining -= delta
          }
        } else {
          currentLocation = add(currentLocation, offsetRemaining)
          offsetRemaining = 0
        }
      }

      return currentLocation
    } else {
      let currentLocation = this.clampDown(start)
      let offsetRemaining = offset

      while (offsetRemaining < 0) {
        const futureRanges = this.ranges.filter(r => r[1] < currentLocation).sort((a, b) => b[0] - a[0])

        if (futureRanges.length) {
          const nextRange = futureRanges[0]
          const delta = nextRange[1] - currentLocation

          if (delta < offsetRemaining) {
            currentLocation = add(currentLocation, offsetRemaining)
            offsetRemaining = 0
          } else {
            currentLocation = nextRange[0]
            offsetRemaining -= delta
          }
        } else {
          currentLocation = add(currentLocation, offsetRemaining)
          offsetRemaining = 0
        }
      }

      return currentLocation
    }
  }

  clampUp (d) {
    return this.ranges.reduce((value, range) => inRange(value, range) ? range[1] : value, d)
  }

  clampDown (d) {
    return this.ranges.reduce((value, range) => inRange(value, range) ? range[0] : value, d)
  }

  copy () {
    return new Range(...this.ranges)
  }
}

export default Range
