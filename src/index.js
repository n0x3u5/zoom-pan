import Transform from './transform'
import ScaleLinear from './scales/linear'

const identity = new Transform(1, 0, 0)
const xScale = new ScaleLinear().setDomain([-0.5, 11.5])
const yScale = new ScaleLinear().setDomain([0, 100000])

let transformer = new Transform(1, 0, 0)

const decrementX = document.querySelector('#x .decrement')
const incrementX = document.querySelector('#x .increment')
const resetButton = document.querySelector('#reset')
const zoomButton = document.querySelector('#zoom')
const decrementY = document.querySelector('#y .decrement')
const incrementY = document.querySelector('#y .increment')
const resultX = document.querySelector('#result-x')
const resultY = document.querySelector('#result-y')

const round = d => Number(d.toFixed(5))
const logXDomain = s => {
  resultX.innerHTML = `Horizontal Scale: ${s.getDomain().map(round)}`
}
const logYDomain = s => {
  resultY.innerHTML = `Vertical Scale: ${s.getDomain().map(round)}`
}

logXDomain(xScale)
logYDomain(yScale)

decrementX.addEventListener('click', () => {
  transformer = transformer.translate(0.1, 0)
  logXDomain(transformer.rescaleX(xScale))
})
incrementX.addEventListener('click', () => {
  transformer = transformer.translate(-0.1, 0)
  logXDomain(transformer.rescaleX(xScale))
})

resetButton.addEventListener('click', () => {
  transformer = new Transform(1, 0, 0)
  logXDomain(identity.rescaleX(xScale))
  logYDomain(identity.rescaleY(yScale))
})

decrementY.addEventListener('click', () => {
  transformer = transformer.translate(0, 0.1)
  logYDomain(transformer.rescaleY(yScale))
})
incrementY.addEventListener('click', () => {
  transformer = transformer.translate(0, -0.1)
  logYDomain(transformer.rescaleY(yScale))
})

zoomButton.addEventListener('click', () => {
  transformer = transformer.zoom(2)
  logXDomain(transformer.rescaleX(xScale))
  logYDomain(transformer.rescaleY(yScale))
})
