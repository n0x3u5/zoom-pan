class Transform {
  constructor (k, x, y) {
    this.k = k
    this.x = x
    this.y = y
  }

  zoom (k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y)
  }

  translate (x, y) {
    return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y)
  }

  apply (point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y]
  }

  applyX (pointX) {
    return pointX * this.k + this.x
  }

  applyY (pointY) {
    return pointY * this.k + this.y
  }

  invert (position) {
    return [(position[0] - this.x) / this.k, (position[1] - this.y) / this.k]
  }

  invertX (positionX) {
    return (positionX - this.x) / this.k
  }

  invertY (positionY) {
    return (positionY - this.y) / this.k
  }

  rescaleX (scaleX) {
    return scaleX.copy().setDomain(scaleX.getRange().map(this.invertX, this).map(scaleX.getDomainValue, scaleX))
  }

  rescaleY (scaleY) {
    return scaleY.copy().setDomain(scaleY.getRange().map(this.invertY, this).map(scaleY.getDomainValue, scaleY))
  }

  toString () {
    return `translate(${this.x},${this.y}) scale(${this.k})`
  }
}

let identity = new Transform(1, 0, 0)

export default function transform (component) {
  return component.__zoom || identity
}

export { identity }
