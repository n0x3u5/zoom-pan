import Dispatcher from './dispatcher'

class Zoom {
  on () {
    return new Dispatcher('zoom')
  }
}

export default Zoom
