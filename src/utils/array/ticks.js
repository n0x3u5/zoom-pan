const E10 = Math.sqrt(50)
const E5 = Math.sqrt(10)
const E2 = Math.sqrt(2)

function getMultiplier (error) {
  let errorFactor

  if (error >= E10) {
    errorFactor = 10
  } else if (error >= E5) {
    errorFactor = 5
  } else if (error >= E2) {
    errorFactor = 2
  } else {
    errorFactor = 1
  }

  return errorFactor
}

function tickIncrement (start = 0, stop = 1, count = 7) {
  const step = (stop - start) / Math.max(0, count)
  const power = Math.floor(Math.log(step) / Math.LN10)
  const error = step / Math.pow(10, power)

  if (power >= 0) {
    return getMultiplier(error) * Math.pow(10, power)
  } else {
    return -Math.pow(10, -power) / getMultiplier(error)
  }
}

function tickStep (start = 0, stop = 1, count = 7) {
  let step0 = Math.abs(stop - start) / Math.max(0, count)
  let power = Math.floor(Math.log(step0) / Math.LN10)
  let step1 = Math.pow(10, power)
  let error = step0 / step1

  if (error >= E10) {
    step1 *= 10
  } else if (error >= E5) {
    step1 *= 5
  } else if (error >= E2) {
    step1 *= 2
  }

  return stop < start ? -step1 : step1
}

function ticks (start = 0, stop = 1, count = 7) {
  let reverse
  let i = -1
  let n
  let tickArr = []
  let step

  stop = +stop
  start = +start
  count = +count

  if (start === stop && count > 0) return [start]

  reverse = stop < start

  if (reverse) {
    n = start
    start = stop
    stop = n
  }

  step = tickIncrement(start, stop, count)

  if (step === 0 || !isFinite(step)) return []

  if (step > 0) {
    start = Math.ceil(start / step)
    stop = Math.floor(stop / step)
    n = Math.ceil(stop - start + 1)
    while (++i < n) tickArr[i] = (start + i) * step
  } else {
    start = Math.floor(start * step)
    stop = Math.ceil(stop * step)
    n = Math.ceil(start - stop + 1)
    while (++i < n) tickArr[i] = (start - i) / step
  }

  if (reverse) tickArr.reverse()

  return tickArr
}

export default ticks
export { tickIncrement, tickStep }
