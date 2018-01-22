const tickFilter = (ticks, discontinuity) => {
  const discontinuousTicks = []
  let tick
  let up
  let down

  for (let i = 0, ii = ticks.length; i < ii; i++) {
    tick = ticks[i]
    up = discontinuity.clampUp(tick)
    down = discontinuity.clampDown(tick)

    if (up === down) discontinuousTicks.push(up)
  }

  return discontinuousTicks
}

export default tickFilter
