/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _zoom = __webpack_require__(1);

var _zoom2 = _interopRequireDefault(_zoom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _zoom2.default().on('zoom', function () {
  return 'zoomed';
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dispatcher = __webpack_require__(2);

var _dispatcher2 = _interopRequireDefault(_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Zoom = function () {
  function Zoom() {
    _classCallCheck(this, Zoom);
  }

  _createClass(Zoom, [{
    key: 'on',
    value: function on() {
      return new _dispatcher2.default('zoom');
    }
  }]);

  return Zoom;
}();

exports.default = Zoom;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var noop = { value: function value() {} };

var sanitiseTypes = function sanitiseTypes(typeMap, type) {
  if (!(type + '') || type in typeMap) {
    throw new Error('Illegal dispatch type: ' + type);
  } else {
    typeMap[type] = [];
  }
  return typeMap;
};

var parseTypenames = function parseTypenames(typeName, typeMap) {
  return typeName.trim().split(/^|\s+/).map(function (type) {
    var i = type.indexOf('.');
    var name = '';

    if (i >= 0) {
      name = type.slice(i + 1);
      type = type.slice(0, i);
    }

    if (type && !typeMap.hasOwnProperty(type)) throw new Error('Unknown dispatch type: ' + type);

    return { name: name, type: type };
  });
};

var get = function get(types, name) {
  var foundType = types.find(function (type) {
    return type.name === name;
  });
  if (foundType) return foundType.value;
};

var set = function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; i++) {
    if (type[i].name === name) {
      type[i] = noop;
      type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({ name: name, value: callback });

  return type;
};

var Dispatcher = function () {
  function Dispatcher() {
    _classCallCheck(this, Dispatcher);

    for (var _len = arguments.length, types = Array(_len), _key = 0; _key < _len; _key++) {
      types[_key] = arguments[_key];
    }

    this.typeMap = types.reduce(sanitiseTypes, {});
  }

  _createClass(Dispatcher, [{
    key: 'on',
    value: function on(typeName, listener) {
      var typeMap = this.typeMap;
      var typeNames = parseTypenames(typeName + '', typeMap);
      var n = typeNames.length;
      var i = 0;
      var type = void 0;

      if (arguments.length < 2) {
        while (i < n) {
          type = typeNames[i].type && get(typeMap[typeNames[i].type], typeNames[i].name);
          if (type) return type;
          i++;
        }
        return;
      }

      if (listener != null && typeof listener !== 'function') throw new Error('Invalid dispatch listener: ' + listener);

      while (i < n) {
        type = typeNames[i].type;
        if (type) {
          typeMap[type] = set(typeMap[type], typeNames[i].name, listener);
        } else if (listener == null) {
          for (type in typeMap) {
            typeMap[type] = set(typeMap[type], typeNames[i].name, null);
          }
        }
        i++;
      }

      return this;
    }
  }, {
    key: 'dispatch',
    value: function dispatch(typeName, that, args) {
      if (!this.typeMap.hasOwnProperty(typeName)) throw new Error('Unknown dispatch type: ' + typeName);

      var type = this.typeMap[typeName];
      for (var i = 0, n = type.length; i < n; i++) {
        type[i].value.apply(that, args);
      }
    }
  }]);

  return Dispatcher;
}();

exports.default = Dispatcher;

/***/ })
/******/ ]);