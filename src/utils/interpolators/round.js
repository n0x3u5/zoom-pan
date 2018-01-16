function interpolateRound (min, max) {
  min = Number(min)
  max = Number(max)

  let diff = max - min

  return ratio => Math.round((diff * ratio) + min)
}

export default interpolateRound
