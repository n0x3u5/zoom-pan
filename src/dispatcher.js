const noop = { value: () => {} }

const sanitiseTypes = (typeMap, type) => {
  if (!(type + '') || (type in typeMap)) {
    throw new Error(`Illegal dispatch type: ${type}`)
  } else {
    typeMap[type] = []
  }
  return typeMap
}

const parseTypenames = (typeName, typeMap) => {
  return typeName.trim().split(/^|\s+/).map(type => {
    let i = type.indexOf('.')
    let name = ''

    if (i >= 0) {
      name = type.slice(i + 1)
      type = type.slice(0, i)
    }

    if (type && !typeMap.hasOwnProperty(type)) throw new Error(`Unknown dispatch type: ${type}`)

    return { name, type }
  })
}

const get = (types, name) => {
  let foundType = types.find(type => type.name === name)
  if (foundType) return foundType.value
}

const set = (type, name, callback) => {
  for (let i = 0, n = type.length; i < n; i++) {
    if (type[i].name === name) {
      type[i] = noop
      type = type.slice(0, i).concat(type.slice(i + 1))
      break
    }
  }
  if (callback != null) type.push({name: name, value: callback})

  return type
}

class Dispatcher {
  constructor (...types) {
    this.typeMap = types.reduce(sanitiseTypes, {})
  }

  on (typeName, listener) {
    let typeMap = this.typeMap
    let typeNames = parseTypenames(typeName + '', typeMap)
    let n = typeNames.length
    let i = 0
    let type

    if (arguments.length < 2) {
      while (i < n) {
        type = typeNames[i].type && get(typeMap[typeNames[i].type], typeNames[i].name)
        if (type) return type
        i++
      }
      return
    }

    if (listener != null && typeof listener !== 'function') throw new Error(`Invalid dispatch listener: ${listener}`)

    while (i < n) {
      type = typeNames[i].type
      if (type) {
        typeMap[type] = set(typeMap[type], typeNames[i].name, listener)
      } else if (listener == null) {
        for (type in typeMap) {
          typeMap[type] = set(typeMap[type], typeNames[i].name, null)
        }
      }
      i++
    }

    return this
  }

  dispatch (typeName, that, args) {
    if (!this.typeMap.hasOwnProperty(typeName)) throw new Error(`Unknown dispatch type: ${typeName}`)

    let type = this.typeMap[typeName]
    for (let i = 0, n = type.length; i < n; i++) type[i].value.apply(that, args)
  }
}

export default Dispatcher
