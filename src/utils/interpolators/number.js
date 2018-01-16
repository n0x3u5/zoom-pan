function interpolateNumber (min, max) {
  min = Number(min)
  max = Number(max)

  let diff = max - min

  return ratio => (diff * ratio) + min
}

export default interpolateNumber
