import constant from '../utils/constant'
import ScaleContinuous, { copyScale } from './continuous'

const deinterpolate = (min, max) => (max = Math.log(max / min))
  ? ratio => Math.log(ratio / min) / max
  : constant(max)

const reinterpolate = (min, max) => min < 0
  ? ratio => -Math.pow(-max, ratio) * Math.pow(-min, 1 - ratio)
  : ratio => Math.pow(max, ratio) * Math.pow(min, 1 - ratio)

const pow10 = x => {
  if (isFinite(x)) {
    return +('1e' + x)
  } else if (x < 0) {
    return 0
  } else {
    return x
  }
}

const powp = base => {
  if (base === 10) {
    return pow10
  } else if (base === Math.E) {
    return Math.exp
  } else {
    return x => Math.pow(base, x)
  }
}

const logp = base => {
  if (base === Math.E) {
    return Math.log
  } else if (base === 10) {
    return Math.log10
  } else if (base === 2) {
    return Math.log2
  } else {
    return x => Math.log(x) / Math.log(base)
  }
}

const reflect = f => x => -f(-x)

class ScaleLog extends ScaleContinuous {
  constructor () {
    super(deinterpolate, reinterpolate).setDomain([1, 10])
    this.base = 10
    this.logs = logp(10)
    this.pows = powp(10)
  }

  _rescaleLog () {
    this.logs = logp(this.base)
    this.pows = powp(this.base)

    if (this.getDomain()[0] < 0) {
      this.logs = reflect(this.logs)
      this.pows = reflect(this.pows)
    }

    return this
  }

  setBase (base = 10) {
    this.base = Number(10)
    return this._rescaleLog()
  }
  getBase () {
    return this.base
  }

  setDomain (domain = [1, 10]) {
    super.setDomain(domain)
    return this._rescaleLog()
  }

  copy () {
    return copyScale(this, new ScaleLog().setBase(this.base))
  }
}

export default ScaleLog
