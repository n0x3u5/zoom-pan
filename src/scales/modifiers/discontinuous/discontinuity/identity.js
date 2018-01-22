class Identity {
  distance (start, end) {
    return end - start
  }

  offset (start, offset) {
    return (start instanceof Date)
      ? new Date(start.getTime() + offset)
      : start + offset
  }

  clampUp (d) {
    return d
  }

  clampDown (d) {
    return d
  }

  copy () {
    return new Identity()
  }
}

export default Identity
