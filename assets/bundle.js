(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var getContext = require('get-canvas-context')

module.exports = function get2DContext (opt) {
  return getContext('2d', opt)
}

},{"get-canvas-context":39}],2:[function(require,module,exports){
var str = Object.prototype.toString

module.exports = anArray

function anArray(arr) {
  return (
       arr.BYTES_PER_ELEMENT
    && str.call(arr.buffer) === '[object ArrayBuffer]'
    || Array.isArray(arr)
  )
}

},{}],3:[function(require,module,exports){
var size = require('element-size')

module.exports = fit

var scratch = new Float32Array(2)

function fit(canvas, parent, scale) {
  var isSVG = canvas.nodeName.toUpperCase() === 'SVG'

  canvas.style.position = canvas.style.position || 'absolute'
  canvas.style.top = 0
  canvas.style.left = 0

  resize.scale  = parseFloat(scale || 1)
  resize.parent = parent

  return resize()

  function resize() {
    var p = resize.parent || canvas.parentNode
    if (typeof p === 'function') {
      var dims   = p(scratch) || scratch
      var width  = dims[0]
      var height = dims[1]
    } else
    if (p && p !== document.body) {
      var psize  = size(p)
      var width  = psize[0]|0
      var height = psize[1]|0
    } else {
      var width  = window.innerWidth
      var height = window.innerHeight
    }

    if (isSVG) {
      canvas.setAttribute('width', width * resize.scale + 'px')
      canvas.setAttribute('height', height * resize.scale + 'px')
    } else {
      canvas.width = width * resize.scale
      canvas.height = height * resize.scale
    }

    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    return resize
  }
}

},{"element-size":38}],4:[function(require,module,exports){
var fitter = require('canvas-fit')
var loop = require('raf-loop')

module.exports = function (canvas, opt) {
  if (!canvas) {
    throw new TypeError('must specify a canvas element')
  }
  
  opt = opt || {}
  var fit = fitter(canvas, opt.parent, opt.scale)
  var app = loop()
  var shape = [0, 0]

  resize()

  window.addEventListener('resize', function () {
    resize()
    app.emit('resize')
  }, false)

  Object.defineProperties(app, {
    scale: {
      get: function () {
        return fit.scale
      },
      set: function (s) {
        fit.scale = s
      }
    },
    shape: {
      get: function () {
        return shape
      }
    },
    parent: {
      get: function () {
        return fit.parent
      },
      set: function (p) {
        fit.parent = p
      }
    }
  })

  return app

  function resize () {
    fit()
    var deviceWidth = canvas.width
    var deviceHeight = canvas.height
    shape[0] = deviceWidth / fit.scale
    shape[1] = deviceHeight / fit.scale
  }
}

},{"canvas-fit":3,"raf-loop":48}],5:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn)
  }

});

},{}],6:[function(require,module,exports){
function backInOut(t) {
  var s = 1.70158 * 1.525
  if ((t *= 2) < 1)
    return 0.5 * (t * t * ((s + 1) * t - s))
  return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2)
}

module.exports = backInOut
},{}],7:[function(require,module,exports){
function backIn(t) {
  var s = 1.70158
  return t * t * ((s + 1) * t - s)
}

module.exports = backIn
},{}],8:[function(require,module,exports){
function backOut(t) {
  var s = 1.70158
  return --t * t * ((s + 1) * t + s) + 1
}

module.exports = backOut
},{}],9:[function(require,module,exports){
var bounceOut = require('./bounce-out')

function bounceInOut(t) {
  return t < 0.5
    ? 0.5 * (1.0 - bounceOut(1.0 - t * 2.0))
    : 0.5 * bounceOut(t * 2.0 - 1.0) + 0.5
}

module.exports = bounceInOut
},{"./bounce-out":11}],10:[function(require,module,exports){
var bounceOut = require('./bounce-out')

function bounceIn(t) {
  return 1.0 - bounceOut(1.0 - t)
}

module.exports = bounceIn
},{"./bounce-out":11}],11:[function(require,module,exports){
function bounceOut(t) {
  var a = 4.0 / 11.0
  var b = 8.0 / 11.0
  var c = 9.0 / 10.0

  var ca = 4356.0 / 361.0
  var cb = 35442.0 / 1805.0
  var cc = 16061.0 / 1805.0

  var t2 = t * t

  return t < a
    ? 7.5625 * t2
    : t < b
      ? 9.075 * t2 - 9.9 * t + 3.4
      : t < c
        ? ca * t2 - cb * t + cc
        : 10.8 * t * t - 20.52 * t + 10.72
}

module.exports = bounceOut
},{}],12:[function(require,module,exports){
function circInOut(t) {
  if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1)
  return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
}

module.exports = circInOut
},{}],13:[function(require,module,exports){
function circIn(t) {
  return 1.0 - Math.sqrt(1.0 - t * t)
}

module.exports = circIn
},{}],14:[function(require,module,exports){
function circOut(t) {
  return Math.sqrt(1 - ( --t * t ))
}

module.exports = circOut
},{}],15:[function(require,module,exports){
function cubicInOut(t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0
}

module.exports = cubicInOut
},{}],16:[function(require,module,exports){
function cubicIn(t) {
  return t * t * t
}

module.exports = cubicIn
},{}],17:[function(require,module,exports){
function cubicOut(t) {
  var f = t - 1.0
  return f * f * f + 1.0
}

module.exports = cubicOut
},{}],18:[function(require,module,exports){
function elasticInOut(t) {
  return t < 0.5
    ? 0.5 * Math.sin(+13.0 * Math.PI/2 * 2.0 * t) * Math.pow(2.0, 10.0 * (2.0 * t - 1.0))
    : 0.5 * Math.sin(-13.0 * Math.PI/2 * ((2.0 * t - 1.0) + 1.0)) * Math.pow(2.0, -10.0 * (2.0 * t - 1.0)) + 1.0
}

module.exports = elasticInOut
},{}],19:[function(require,module,exports){
function elasticIn(t) {
  return Math.sin(13.0 * t * Math.PI/2) * Math.pow(2.0, 10.0 * (t - 1.0))
}

module.exports = elasticIn
},{}],20:[function(require,module,exports){
function elasticOut(t) {
  return Math.sin(-13.0 * (t + 1.0) * Math.PI/2) * Math.pow(2.0, -10.0 * t) + 1.0
}

module.exports = elasticOut
},{}],21:[function(require,module,exports){
function expoInOut(t) {
  return (t === 0.0 || t === 1.0)
    ? t
    : t < 0.5
      ? +0.5 * Math.pow(2.0, (20.0 * t) - 10.0)
      : -0.5 * Math.pow(2.0, 10.0 - (t * 20.0)) + 1.0
}

module.exports = expoInOut
},{}],22:[function(require,module,exports){
function expoIn(t) {
  return t === 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0))
}

module.exports = expoIn
},{}],23:[function(require,module,exports){
function expoOut(t) {
  return t === 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t)
}

module.exports = expoOut
},{}],24:[function(require,module,exports){
module.exports = {
	'backInOut': require('./back-in-out'),
	'backIn': require('./back-in'),
	'backOut': require('./back-out'),
	'bounceInOut': require('./bounce-in-out'),
	'bounceIn': require('./bounce-in'),
	'bounceOut': require('./bounce-out'),
	'circInOut': require('./circ-in-out'),
	'circIn': require('./circ-in'),
	'circOut': require('./circ-out'),
	'cubicInOut': require('./cubic-in-out'),
	'cubicIn': require('./cubic-in'),
	'cubicOut': require('./cubic-out'),
	'elasticInOut': require('./elastic-in-out'),
	'elasticIn': require('./elastic-in'),
	'elasticOut': require('./elastic-out'),
	'expoInOut': require('./expo-in-out'),
	'expoIn': require('./expo-in'),
	'expoOut': require('./expo-out'),
	'linear': require('./linear'),
	'quadInOut': require('./quad-in-out'),
	'quadIn': require('./quad-in'),
	'quadOut': require('./quad-out'),
	'quartInOut': require('./quart-in-out'),
	'quartIn': require('./quart-in'),
	'quartOut': require('./quart-out'),
	'quintInOut': require('./quint-in-out'),
	'quintIn': require('./quint-in'),
	'quintOut': require('./quint-out'),
	'sineInOut': require('./sine-in-out'),
	'sineIn': require('./sine-in'),
	'sineOut': require('./sine-out')
}
},{"./back-in":7,"./back-in-out":6,"./back-out":8,"./bounce-in":10,"./bounce-in-out":9,"./bounce-out":11,"./circ-in":13,"./circ-in-out":12,"./circ-out":14,"./cubic-in":16,"./cubic-in-out":15,"./cubic-out":17,"./elastic-in":19,"./elastic-in-out":18,"./elastic-out":20,"./expo-in":22,"./expo-in-out":21,"./expo-out":23,"./linear":25,"./quad-in":27,"./quad-in-out":26,"./quad-out":28,"./quart-in":30,"./quart-in-out":29,"./quart-out":31,"./quint-in":33,"./quint-in-out":32,"./quint-out":34,"./sine-in":36,"./sine-in-out":35,"./sine-out":37}],25:[function(require,module,exports){
function linear(t) {
  return t
}

module.exports = linear
},{}],26:[function(require,module,exports){
function quadInOut(t) {
    t /= 0.5
    if (t < 1) return 0.5*t*t
    t--
    return -0.5 * (t*(t-2) - 1)
}

module.exports = quadInOut
},{}],27:[function(require,module,exports){
function quadIn(t) {
  return t * t
}

module.exports = quadIn
},{}],28:[function(require,module,exports){
function quadOut(t) {
  return -t * (t - 2.0)
}

module.exports = quadOut
},{}],29:[function(require,module,exports){
function quarticInOut(t) {
  return t < 0.5
    ? +8.0 * Math.pow(t, 4.0)
    : -8.0 * Math.pow(t - 1.0, 4.0) + 1.0
}

module.exports = quarticInOut
},{}],30:[function(require,module,exports){
function quarticIn(t) {
  return Math.pow(t, 4.0)
}

module.exports = quarticIn
},{}],31:[function(require,module,exports){
function quarticOut(t) {
  return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0
}

module.exports = quarticOut
},{}],32:[function(require,module,exports){
function qinticInOut(t) {
    if ( ( t *= 2 ) < 1 ) return 0.5 * t * t * t * t * t
    return 0.5 * ( ( t -= 2 ) * t * t * t * t + 2 )
}

module.exports = qinticInOut
},{}],33:[function(require,module,exports){
function qinticIn(t) {
  return t * t * t * t * t
}

module.exports = qinticIn
},{}],34:[function(require,module,exports){
function qinticOut(t) {
  return --t * t * t * t * t + 1
}

module.exports = qinticOut
},{}],35:[function(require,module,exports){
function sineInOut(t) {
  return -0.5 * (Math.cos(Math.PI*t) - 1)
}

module.exports = sineInOut
},{}],36:[function(require,module,exports){
function sineIn (t) {
  var v = Math.cos(t * Math.PI * 0.5)
  if (Math.abs(v) < 1e-14) return 1
  else return 1 - v
}

module.exports = sineIn

},{}],37:[function(require,module,exports){
function sineOut(t) {
  return Math.sin(t * Math.PI/2)
}

module.exports = sineOut
},{}],38:[function(require,module,exports){
module.exports = getSize

function getSize(element) {
  // Handle cases where the element is not already
  // attached to the DOM by briefly appending it
  // to document.body, and removing it again later.
  if (element === window || element === document.body) {
    return [window.innerWidth, window.innerHeight]
  }

  if (!element.parentNode) {
    var temporary = true
    document.body.appendChild(element)
  }

  var bounds = element.getBoundingClientRect()
  var styles = getComputedStyle(element)
  var height = (bounds.height|0)
    + parse(styles.getPropertyValue('margin-top'))
    + parse(styles.getPropertyValue('margin-bottom'))
  var width  = (bounds.width|0)
    + parse(styles.getPropertyValue('margin-left'))
    + parse(styles.getPropertyValue('margin-right'))

  if (temporary) {
    document.body.removeChild(element)
  }

  return [width, height]
}

function parse(prop) {
  return parseFloat(prop) || 0
}

},{}],39:[function(require,module,exports){
module.exports = getCanvasContext
function getCanvasContext (type, opts) {
  if (typeof type !== 'string') {
    throw new TypeError('must specify type string')
  }
  if (typeof document === 'undefined') {
    return null // check for Node
  }

  opts = opts || {}
  var canvas = opts.canvas || document.createElement('canvas')
  if (typeof opts.width === 'number') {
    canvas.width = opts.width
  }
  if (typeof opts.height === 'number') {
    canvas.height = opts.height
  }

  var attribs = opts
  var gl
  try {
    var names = [ type ]
    // prefix GL contexts
    if (type.indexOf('webgl') === 0) {
      names.push('experimental-' + type)
    }

    for (var i = 0; i < names.length; i++) {
      gl = canvas.getContext(names[i], attribs)
      if (gl) return gl
    }
  } catch (e) {
    gl = null
  }
  return (gl || null) // ensure null on fail
}

},{}],40:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],41:[function(require,module,exports){
var lerp = require('lerp')

module.exports = function lerpValues(value1, value2, t, out) {
    if (typeof value1 === 'number'
            && typeof value2 === 'number')
        return lerp(value1, value2, t)
    else { //assume array
        var len = Math.min(value1.length, value2.length)
        out = out||new Array(len)
        for (var i=0; i<len; i++) 
            out[i] = lerp(value1[i], value2[i], t)
        return out
    }
}
},{"lerp":42}],42:[function(require,module,exports){
function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}
module.exports = lerp
},{}],43:[function(require,module,exports){
(function (global){
/**
 * lodash 4.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var keys = require('lodash.keys'),
    rest = require('lodash.rest');

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/** Used for built-in method references. */
var objectProto = global.Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if ((!eq(objValue, value) ||
        (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property names to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object) {
  return copyObjectWith(source, props, object);
}

/**
 * This function is like `copyObject` except that it accepts a function to
 * customize copied values.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property names to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObjectWith(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index],
        newValue = customizer ? customizer(object[key], source[key], key, object, source) : source[key];

    assignValue(object, key, newValue);
  }
  return object;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return rest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = typeof customizer == 'function' ? (length--, customizer) : undefined;
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, customizer);
      }
    }
    return object;
  });
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
      ? (isArrayLike(object) && isIndex(index, object.length))
      : (type == 'string' && index in object)) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Performs a [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var other = { 'user': 'fred' };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null &&
    !(typeof value == 'function' && isFunction(value)) && isLength(getLength(value));
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array constructors, and
  // PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is loosely based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Assigns own enumerable properties of source objects to the destination
 * object. Source objects are applied from left to right. Subsequent sources
 * overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object` and is loosely based on
 * [`Object.assign`](https://mdn.io/Object/assign).
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function Foo() {
 *   this.c = 3;
 * }
 *
 * function Bar() {
 *   this.e = 5;
 * }
 *
 * Foo.prototype.d = 4;
 * Bar.prototype.f = 6;
 *
 * _.assign({ 'a': 1 }, new Foo, new Bar);
 * // => { 'a': 1, 'c': 3, 'e': 5 }
 */
var assign = createAssigner(function(object, source) {
  copyObject(source, keys(source), object);
});

module.exports = assign;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"lodash.keys":44,"lodash.rest":45}],44:[function(require,module,exports){
(function (global){
/**
 * lodash 4.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    stringTag = '[object String]';

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/** Used for built-in method references. */
var objectProto = global.Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var getPrototypeOf = Object.getPrototypeOf,
    propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = Object.keys;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
  // that are composed entirely of index properties, return `false` for
  // `hasOwnProperty` checks of them.
  return hasOwnProperty.call(object, key) ||
    (typeof object == 'object' && key in object && getPrototypeOf(object) === null);
}

/**
 * The base implementation of `_.keys` which doesn't skip the constructor
 * property of prototypes or treat sparse arrays as dense.
 *
 * @private
 * @type Function
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  return nativeKeys(Object(object));
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Creates an array of index keys for `object` values of arrays,
 * `arguments` objects, and strings, otherwise `null` is returned.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array|null} Returns index keys, else `null`.
 */
function indexKeys(object) {
  var length = object ? object.length : undefined;
  return (isLength(length) && (isArray(object) || isString(object) || isArguments(object)))
    ? baseTimes(length, String)
    : null;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null &&
    !(typeof value == 'function' && isFunction(value)) && isLength(getLength(value));
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object, else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array constructors, and
  // PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is loosely based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  var isProto = isPrototype(object);
  if (!(isProto || isArrayLike(object))) {
    return baseKeys(object);
  }
  var indexes = indexKeys(object),
      skipIndexes = !!indexes,
      result = indexes || [],
      length = result.length;

  for (var key in object) {
    if (baseHas(object, key) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
        !(isProto && key == 'constructor')) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keys;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],45:[function(require,module,exports){
(function (global){
/**
 * lodash 4.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308,
    NAN = 0 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `global`. */
var freeParseInt = parseInt;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  var length = args ? args.length : 0;
  switch (length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/** Used for built-in method references. */
var objectProto = global.Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as an array.
 *
 * **Note:** This method is based on the [rest parameter](https://mdn.io/rest_parameters).
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.rest(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function rest(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : toInteger(start), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, array);
      case 1: return func.call(this, args[0], array);
      case 2: return func.call(this, args[0], args[1], array);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array constructors, and
  // PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This function is loosely based on [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3');
 * // => 3
 */
function toInteger(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  var remainder = value % 1;
  return value === value ? (remainder ? value - remainder : value) : 0;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3);
 * // => 3
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3');
 * // => 3
 */
function toNumber(value) {
  if (isObject(value)) {
    var other = isFunction(value.valueOf) ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = rest;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],46:[function(require,module,exports){
var xtend = require('xtend')

var defaults = {
	enumerable: true,
	configurable: true
}

function mix(obj, entries) {
	for (var k in entries) {
		if (!entries.hasOwnProperty(k))
			continue
		var f = entries[k]
		if (typeof f === 'function') {
			obj[k] = f
		} else if (f && typeof f === 'object') {
			var def = xtend(defaults, f)
			Object.defineProperty(obj, k, def);
		}
	}
}

module.exports = function mixes(ctor, entries) {
	mix(ctor.prototype, entries)
}

module.exports.mix = mix
},{"xtend":60}],47:[function(require,module,exports){
(function (process){
// Generated by CoffeeScript 1.7.1
(function() {
  var getNanoSeconds, hrtime, loadTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

}).call(this,require('_process'))
},{"_process":74}],48:[function(require,module,exports){
var inherits = require('inherits')
var EventEmitter = require('events').EventEmitter
var now = require('right-now')
var raf = require('raf')

module.exports = Engine
function Engine(fn) {
    if (!(this instanceof Engine)) 
        return new Engine(fn)
    this.running = false
    this.last = now()
    this._frame = 0
    this._tick = this.tick.bind(this)

    if (fn)
        this.on('tick', fn)
}

inherits(Engine, EventEmitter)

Engine.prototype.start = function() {
    if (this.running) 
        return
    this.running = true
    this.last = now()
    this._frame = raf(this._tick)
    return this
}

Engine.prototype.stop = function() {
    this.running = false
    if (this._frame !== 0)
        raf.cancel(this._frame)
    this._frame = 0
    return this
}

Engine.prototype.tick = function() {
    this._frame = raf(this._tick)
    var time = now()
    var dt = time - this.last
    this.emit('tick', dt)
    this.last = time
}
},{"events":73,"inherits":40,"raf":49,"right-now":51}],49:[function(require,module,exports){
var now = require('performance-now')
  , global = typeof window === 'undefined' ? {} : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = global['request' + suffix]
  , caf = global['cancel' + suffix] || global['cancelRequest' + suffix]

for(var i = 0; i < vendors.length && !raf; i++) {
  raf = global[vendors[i] + 'Request' + suffix]
  caf = global[vendors[i] + 'Cancel' + suffix]
      || global[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(global, fn)
}
module.exports.cancel = function() {
  caf.apply(global, arguments)
}

},{"performance-now":47}],50:[function(require,module,exports){
'use strict';
module.exports = function (min, max) {
	if (max === undefined) {
		max = min;
		min = 0;
	}

	if (typeof min !== 'number' || typeof max !== 'number') {
		throw new TypeError('Expected all arguments to be numbers');
	}

	return Math.floor(Math.random() * (max - min + 1) + min);
};

},{}],51:[function(require,module,exports){
(function (global){
module.exports =
  global.performance &&
  global.performance.now ? function now() {
    return performance.now()
  } : Date.now || function now() {
    return +new Date
  }

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],52:[function(require,module,exports){
var noop = function(){}
var linear = require('eases/linear')
var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

function BaseTween(opt) {
    EventEmitter.call(this)

    //users generally don't need to change these
    this.duration = (opt && opt.duration)||0
    this.delay = (opt && opt.delay)||0
    this.time = 0
    this.ease = opt && opt.ease
    this.active = true
    this.enabled = true
    this.cancelling = false
    this._started = false
}

inherits(BaseTween, EventEmitter)

BaseTween.prototype.lerp = noop
BaseTween.prototype.ready = noop

BaseTween.prototype.cancel = function() {
    this.cancelling = true
    return this
}

BaseTween.prototype.tick = function(dt, ease) {
    ease = typeof ease === 'function' ? ease : defaultEase

    if (this.cancelling && this.active) {
        this.active = false
        this.emit('cancelling', this)
        this.emit('complete', this)
    }

    if (!this.active || !this.enabled)
        return

    var last = this.time
    this.time += dt
            
    var alpha = (this.time-this.delay) / this.duration
    if (this.time-this.delay > 0) {
        if (!this._started) {
            this._started = true
            this.ready()
            this.emit('start', this)
        }

        if (alpha < 0)
            alpha = 0
        else if (alpha > 1)
            alpha = 1
        alpha = ease(this, alpha)
        this.lerp(alpha)
        this.emit('update', this)
    }

    if (this.time >= (this.duration+this.delay)) {
        this.active = false
        this.emit('complete', this)
    }
}

function defaultEase(tween, alpha) {
    if (typeof tween.ease === 'function')
        return tween.ease(alpha)
    return linear(alpha)
}

module.exports = BaseTween
},{"eases/linear":25,"events":73,"inherits":40}],53:[function(require,module,exports){
var ObjectTween = require('./lib/object')
var GroupTween = require('./lib/group')

module.exports = function(element, opt) {
    var tween = Array.isArray(element) 
            ? new GroupTween(element, opt)
            : new ObjectTween(element, opt)
    return tween
}
},{"./lib/group":55,"./lib/object":56}],54:[function(require,module,exports){
var BaseTween = require('tween-base')
var isArray = require('an-array')

var ignores = new BaseTween()

module.exports = function getTargets(element, opt) {
    var targets = []
    for (var k in opt) { 
        //copy properties as needed
        if (opt.hasOwnProperty(k) 
                && element.hasOwnProperty(k)
                && !ignores.hasOwnProperty(k)) {
            var startVal = element[k]
            var endVal = opt[k]
            if (typeof startVal === 'number'
                 && typeof endVal === 'number') {
                targets.push({ 
                    key: k, 
                    start: startVal, 
                    end: endVal 
                })
            }
            else if (isArray(startVal) && isArray(endVal)) {
                targets.push({ 
                    key: k, 
                    start: startVal.slice(), 
                    end: endVal.slice() 
                })
            }
        }
    }
    return targets
}
},{"an-array":2,"tween-base":52}],55:[function(require,module,exports){
var inherits = require('inherits')
var lerp = require('lerp-array')
var BaseTween = require('tween-base')
var endTarget = require('./end-target')

function GroupTween(target, opt) {
    BaseTween.call(this, opt)
    this.target = target
    this.end = []
    this._options = opt
}

inherits(GroupTween, BaseTween)

GroupTween.prototype.ready = function() {
    this.end = this.target.map(function(t) {
        return endTarget(t, this._options)
    }, this)
}

GroupTween.prototype.lerp = function(alpha) {
    for (var j=0; j<this.end.length; j++)  {
        var endings = this.end[j]
        var target = this.target[j]
        for (var i=0; i<endings.length; i++) {
            var t = endings[i]
            var k = t.key
            target[k] = lerp(t.start, t.end, alpha, target[k])    
        }
    }
}

module.exports = GroupTween
},{"./end-target":54,"inherits":40,"lerp-array":41,"tween-base":52}],56:[function(require,module,exports){
var inherits = require('inherits')
var lerp = require('lerp-array')
var BaseTween = require('tween-base')
var endTarget = require('./end-target')

function ObjectTween(target, opt) {
    BaseTween.call(this, opt)
    this.target = target
    this.endings = undefined
    this._options = opt
}

inherits(ObjectTween, BaseTween)

ObjectTween.prototype.ready = function() {
    this.endings = endTarget(this.target, this._options)
}

ObjectTween.prototype.lerp = function(alpha) {
    for (var i=0; i<this.endings.length; i++) {
        var t = this.endings[i]
        var k = t.key
        this.target[k] = lerp(t.start, t.end, alpha, this.target[k])
    }
}

module.exports = ObjectTween
},{"./end-target":54,"inherits":40,"lerp-array":41,"tween-base":52}],57:[function(require,module,exports){
var linear = require('eases/linear')
var createTween = require('tween-objects')
var BaseTween = require('tween-base')

function TweenTicker(opt) {
    if (!(this instanceof TweenTicker))
        return new TweenTicker(opt)
    opt = opt||{}
    this.stack = []
    this.defaultEase = opt.defaultEase || linear
    this.eases = opt.eases || {}
    this._applyEase = this.ease.bind(this)
}

TweenTicker.prototype.cancel = function() {
    for (var i=0; i<this.stack.length; i++) {
        var t = this.stack[i]
        //cancel each and force it to complete
        t.cancel()
        t.tick(0)
    }
    this.stack.length = 0
    return this
}

//no longer used, backward-compatible
TweenTicker.prototype.clear = TweenTicker.prototype.cancel

TweenTicker.prototype.to = function(element, opt) {
    var tween = element
    if (opt && typeof opt === 'object')
        tween = createTween(element, opt)
    else if (!element && !opt) {
        tween = new BaseTween()
    }
    else if (!isTween(tween)) //to avoid programmer error
        throw new Error('must provide options or a tween object')
    return this.push(tween)
}

TweenTicker.prototype.push = function(tween) {
    this.stack.push(tween)
    return tween
}

TweenTicker.prototype.tick = function(dt, ease) {
    ease = typeof ease === 'function' ? ease : this._applyEase
    dt = typeof dt === 'number' ? dt : 1/60

    //for all queued tweens, tick them forward (i.e. DOM read)
    for (var i=0; i<this.stack.length; i++) {
        this.stack[i].tick(dt, ease)
    }

    //now sync their states (i.e. DOM write)
    sync(this.stack)

    //now kill any inactive tweens
    for (i=this.stack.length-1; i>=0; i--)
        if (!this.stack[i].active)
            this.stack.splice(i, 1)
}

//determines which easing function to use based on user options
TweenTicker.prototype.ease = function(tween, alpha) {
    var ease = tween.ease || this.defaultEase
    if (typeof ease === 'string')
        ease = this.eases[ease]
    if (typeof ease !== 'function')
        ease = linear
    return ease(alpha)
}

//mainly intended as a safeguard against potential user error
function isTween(tween) {
    return (typeof tween.tick === 'function' 
            && typeof tween.cancel === 'function')
}

function sync(tweens) {
    for (var i=0; i<tweens.length; i++) {
        var tween = tweens[i]
        if (typeof tween.sync === 'function')
            tween.sync()
    }
}

module.exports = TweenTicker

},{"eases/linear":25,"tween-base":52,"tween-objects":53}],58:[function(require,module,exports){
var xtend = require('xtend')
var eases = require('eases')
var Ticker = require('tween-ticker')
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits')
var mixin = require('mixes')
var loop = require('./loop')

var defaultOpt = { eases: eases }

module.exports = Tweenr
function Tweenr(opt) {
    if (!(this instanceof Tweenr))
        return new Tweenr(opt)

    Ticker.call(this, xtend(defaultOpt, opt))
    EventEmitter.call(this)

    this._handleTick = function(dt) {
        dt = Math.min(30, dt) //cap delta at 30 ms
        dt /= 1000
        this.emit('tick', dt)
        this.tick(dt)
    }.bind(this)

    loop.on('tick', this._handleTick)
}

inherits(Tweenr, Ticker)
mixin(Tweenr, EventEmitter.prototype)

Tweenr.prototype.dispose = function() {
    loop.removeListener('tick', this._handleTick)
}

},{"./loop":59,"eases":24,"events":73,"inherits":40,"mixes":46,"tween-ticker":57,"xtend":60}],59:[function(require,module,exports){
var engine = require('raf-loop')()
engine.start()

module.exports = engine
},{"raf-loop":48}],60:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],61:[function(require,module,exports){
'use strict';

var _domready = require('domready');

var _domready2 = _interopRequireDefault(_domready);

var _dContext = require('2d-context');

var _dContext2 = _interopRequireDefault(_dContext);

var _canvasLoop = require('canvas-loop');

var _canvasLoop2 = _interopRequireDefault(_canvasLoop);

var _grid = require('./lib/grid');

var _grid2 = _interopRequireDefault(_grid);

var _controller = require('./lib/controller');

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var width = undefined,
    height = undefined;

(0, _domready2.default)(function () {

	var shapeCanvas = document.querySelector('canvas.shapes');
	var gridCanvas = document.querySelector('canvas.grid');
	var shapeCtx = (0, _dContext2.default)({ canvas: shapeCanvas });
	var gridCtx = (0, _dContext2.default)({ canvas: gridCanvas });
	var grid = new _grid2.default({ width: 500, height: 280 });

	var shapeLoop = (0, _canvasLoop2.default)(shapeCanvas, {
		scale: window.devicePixelRatio
	});

	var gridLoop = (0, _canvasLoop2.default)(gridCanvas, {
		alpha: true,
		scale: window.devicePixelRatio
	});

	shapeLoop.on('tick', loop);
	shapeLoop.on('resize', shapeResize);
	gridLoop.on('resize', gridResize);

	shapeResize();
	gridResize();
	shapeLoop.start();

	var shapes = _controller2.default.create({ grid: grid, count: 5 });

	shapes.start();

	// draw dots
	// setInterval to create new shapes

	function loop(dt) {
		shapeCtx.clearRect(0, 0, width, height);
		shapeCtx.globalCompositeOperation = 'screen';
		shapes.render(shapeCtx);
		// shapeCtx.globalCompositeOperation = 'source-over'
	}

	function shapeResize() {
		width = shapeLoop.shape[0];
		height = shapeLoop.shape[1];
		grid.resize(width, height);
	}

	function gridResize() {
		grid.render(gridCtx);
	}
});

},{"./lib/controller":63,"./lib/grid":64,"2d-context":1,"canvas-loop":4,"domready":5}],62:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var WIDTH = exports.WIDTH = 500;
var HEIGHT = exports.HEIGHT = 500;

var PADDING = exports.PADDING = 40;
var TWO_PADDING = exports.TWO_PADDING = PADDING * 2;
var RESOLUTION = exports.RESOLUTION = 40; // 1 dot every 40 pixels (approx)
var DOT_RATIO = exports.DOT_RATIO = 1 / 15; // dots are 1/6th the size of the spaces

var PI = exports.PI = Math.PI;
var TWO_PI = exports.TWO_PI = PI * 2;

var COLOURS = exports.COLOURS = ['#f47f50', '#fed418', '#ef4862', '#5ac2b4', '#7abee0'];

var EASING = exports.EASING = 'ease-out-expo';

},{}],63:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _randomInt = require('random-int');

var _randomInt2 = _interopRequireDefault(_randomInt);

var _randomEl = require('./helpers/random-el');

var _randomEl2 = _interopRequireDefault(_randomEl);

var _constants = require('./constants');

var _shapes = require('./shapes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var allowedShapes = [_shapes.Circle, _shapes.Triangle, _shapes.Square];

// Semicircle
var LOW_TIME = 150;
var HIGH_TIME = 3000;

var ShapeController = function () {
	function ShapeController(opts) {
		_classCallCheck(this, ShapeController);

		this.shapes = Array.isArray(opts.shapes) ? shapes : [];
		this.count = opts.count;
		this.grid = opts.grid || null;
		this.timer = null;
	}

	/**
  * Randomly generate shapes up to the specified amount
  */

	_createClass(ShapeController, [{
		key: 'add',
		value: function add(shape) {
			this.shapes.push(shape);
		}
	}, {
		key: 'start',
		value: function start() {
			this.timer = setTimeout(this.tick.bind(this), (0, _randomInt2.default)(LOW_TIME, HIGH_TIME));
		}
	}, {
		key: 'tick',
		value: function tick() {
			var _this = this;

			this.shapes.forEach(function (shape, i) {
				if (shape.hidden) {
					_this.shapes.splice(i, 1);
				}
			});
			if (this.shapes.length > this.count) {
				var shape = this.shapes[0];
				shape.hide();
			}
			var newShape = generateShape(this.grid);
			this.shapes.push(newShape);
			newShape.show();
			this.timer = setTimeout(this.tick.bind(this), (0, _randomInt2.default)(LOW_TIME, HIGH_TIME));
		}
	}, {
		key: 'render',
		value: function render(ctx) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.shapes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var shape = _step.value;

					shape.render(ctx);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}], [{
		key: 'create',
		value: function create(opts) {
			return new ShapeController(opts);
		}
	}]);

	return ShapeController;
}();

exports.default = ShapeController;

function generateShape(grid) {
	var Shape = (0, _randomEl2.default)(allowedShapes);
	var size = (0, _randomInt2.default)(2, 8);
	var shape = new Shape(grid, (0, _randomInt2.default)(size, grid.columns - size), (0, _randomInt2.default)(size, grid.rows - size), size, {
		fill: (0, _randomEl2.default)(_constants.COLOURS)
	});
	return shape;
}

},{"./constants":62,"./helpers/random-el":65,"./shapes":67,"random-int":50}],64:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _lodash = require('lodash.assign');

var _lodash2 = _interopRequireDefault(_lodash);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Grid = function () {
	function Grid(args) {
		_classCallCheck(this, Grid);

		var opts = (0, _lodash2.default)({
			padding: _constants.PADDING,
			spacing: _constants.RESOLUTION,
			fill: 'rgb(0, 0, 0)'
		}, args);

		this.width = opts.width;
		this.height = opts.height;
		this.padding = opts.padding;
		this.spacing = opts.spacing;
		this.fill = opts.fill;
	}

	_createClass(Grid, [{
		key: 'x',
		value: function x(i) {
			return this.padding + i * this.exactSpacing;
		}
	}, {
		key: 'y',
		value: function y(i) {
			return this.padding + i * this.exactSpacing;
		}
	}, {
		key: 'blocks',
		value: function blocks(i) {
			return this.exactSpacing * i;
		}
	}, {
		key: 'render',
		value: function render(ctx) {
			ctx.fillStyle = 'rgb(0, 0, 0)';
			for (var i = 0; i <= this.columns; i++) {
				for (var j = 0; j <= this.rows; j++) {
					ctx.beginPath();
					ctx.arc(this.x(i), this.y(j), this.dotSize, 0, _constants.TWO_PI, true);
					ctx.closePath();
					ctx.fill();
				}
			}
		}
	}, {
		key: 'resize',
		value: function resize(w, h) {
			this.width = w;
			this.height = h;
		}
	}, {
		key: 'innerWidth',
		get: function get() {
			return this.width - this.padding * 2;
		}
	}, {
		key: 'innerHeight',
		get: function get() {
			return this.height - this.padding * 2;
		}
	}, {
		key: 'exactSpacing',
		get: function get() {
			return this.innerWidth / this.columns;
		}
	}, {
		key: 'columns',
		get: function get() {
			return Math.floor(this.innerWidth / this.spacing);
		}
	}, {
		key: 'rows',
		get: function get() {
			return Math.floor(this.innerHeight / this.spacing);
		}
	}, {
		key: 'dotSize',
		get: function get() {
			return this.spacing * _constants.DOT_RATIO;
		}
	}]);

	return Grid;
}();

exports.default = Grid;

var columns = function columns() {
	return Math.floor((width - TWO_PADDING) / _constants.RESOLUTION);
};
var rows = function rows() {
	return Math.floor((height - TWO_PADDING) / _constants.RESOLUTION);
};
var count = function count() {
	return columns() * rows();
};

var dotSize = function dotSize() {
	return _constants.RESOLUTION * _constants.DOT_RATIO;
};

},{"./constants":62,"lodash.assign":43}],65:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (arr) {
	return arr[(0, _randomInt2.default)(arr.length - 1)];
};

var _randomInt = require('random-int');

var _randomInt2 = _interopRequireDefault(_randomInt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"random-int":50}],66:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tweenr = require('tweenr');

var _tweenr2 = _interopRequireDefault(_tweenr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tween = (0, _tweenr2.default)();

exports.default = tween;

},{"tweenr":58}],67:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Square = exports.Triangle = exports.Semicircle = exports.Circle = undefined;

var _circle = require('./shapes/circle');

var _circle2 = _interopRequireDefault(_circle);

var _semicircle = require('./shapes/semicircle');

var _semicircle2 = _interopRequireDefault(_semicircle);

var _triangle = require('./shapes/triangle');

var _triangle2 = _interopRequireDefault(_triangle);

var _square = require('./shapes/square');

var _square2 = _interopRequireDefault(_square);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Circle = _circle2.default;
exports.Semicircle = _semicircle2.default;
exports.Triangle = _triangle2.default;
exports.Square = _square2.default;

},{"./shapes/circle":69,"./shapes/semicircle":70,"./shapes/square":71,"./shapes/triangle":72}],68:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _lodash = require('lodash.assign');

var _lodash2 = _interopRequireDefault(_lodash);

var _randomInt = require('random-int');

var _randomInt2 = _interopRequireDefault(_randomInt);

var _randomEl = require('../helpers/random-el');

var _randomEl2 = _interopRequireDefault(_randomEl);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var directions = {
	top: { x: 0.0, y: -1.0 },
	left: { x: -1.0, y: 0.0 },
	right: { x: 1.0, y: 0.0 },
	bottom: { x: 0.0, y: 1.0 }
};

var AbstractShape = function AbstractShape(args) {
	_classCallCheck(this, AbstractShape);

	var opts = (0, _lodash2.default)({
		fill: _constants.COLOURS[(0, _randomInt2.default)(_constants.COLOURS.length - 1)],
		lifetime: (0, _randomInt2.default)(3000)
	}, args);
	this.fill = opts.fill;
	this.speed = Math.random() * 1.5 + 0.75;
	this.x = 0;
	this.y = 0;
	this.direction = directions[(0, _randomEl2.default)(Object.keys(directions))];
	this.shiftX = this.direction.x;
	this.shiftY = this.direction.y;
};

exports.default = AbstractShape;

},{"../constants":62,"../helpers/random-el":65,"lodash.assign":43,"random-int":50}],69:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _tween = require('../helpers/tween');

var _tween2 = _interopRequireDefault(_tween);

var _constants = require('../constants');

var _abstract = require('./abstract');

var _abstract2 = _interopRequireDefault(_abstract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Circle = function (_AbstractShape) {
	_inherits(Circle, _AbstractShape);

	function Circle(grid, x, y, size, opts) {
		_classCallCheck(this, Circle);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Circle).call(this, opts));

		_this.grid = grid;
		_this.x = x;
		_this.y = y;
		_this.size = Math.floor(size / 2) * 2;
		return _this;
	}

	_createClass(Circle, [{
		key: 'show',
		value: function show() {
			_tween2.default.to(this, {
				shiftX: 0,
				shiftY: 0,
				ease: 'expoOut',
				duration: this.speed
			});
		}
	}, {
		key: 'hide',
		value: function hide() {
			var _this2 = this;

			setTimeout(function () {
				_this2.hidden = true;
			}, this.speed);
			_tween2.default.to(this, {
				shiftX: this.direction.x,
				shiftY: this.direction.y,
				ease: 'expoOut',
				duration: this.speed
			});
		}
	}, {
		key: 'render',
		value: function render(ctx) {
			var x = this.grid.x(this.x);
			var y = this.grid.y(this.y);
			var size = this.grid.blocks(this.size);
			var radius = size / 2;
			var shiftX = this.shiftX * size;
			var shiftY = this.shiftY * size;

			ctx.save();
			ctx.beginPath();
			ctx.rect(x - radius, y - radius, size, size);
			ctx.closePath();
			ctx.clip();
			ctx.beginPath();
			ctx.arc(x + shiftX, y + shiftY, radius, 0, _constants.TWO_PI, true);
			ctx.closePath();
			ctx.fillStyle = this.fill;
			ctx.fill();
			ctx.restore();
		}
	}]);

	return Circle;
}(_abstract2.default);

exports.default = Circle;

},{"../constants":62,"../helpers/tween":66,"./abstract":68}],70:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _randomInt = require('random-int');

var _randomInt2 = _interopRequireDefault(_randomInt);

var _tween = require('../helpers/tween');

var _tween2 = _interopRequireDefault(_tween);

var _constants = require('../constants');

var _abstract = require('./abstract');

var _abstract2 = _interopRequireDefault(_abstract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Circle = function (_AbstractShape) {
	_inherits(Circle, _AbstractShape);

	function Circle(grid, x, y, size, opts) {
		_classCallCheck(this, Circle);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Circle).call(this, opts));

		_this.grid = grid;
		_this.x = x;
		_this.y = y;
		_this.size = Math.floor(size / 2) * 2;
		_this.rotation = Math.round((0, _randomInt2.default)(0, _constants.PI) / (_constants.PI / 2)) * (_constants.PI / 2);
		return _this;
	}

	_createClass(Circle, [{
		key: 'show',
		value: function show() {
			_tween2.default.to(this, {
				shiftX: 0.0,
				shiftY: 0.0,
				ease: 'expoOut',
				duration: this.speed
			});
		}
	}, {
		key: 'hide',
		value: function hide() {
			var _this2 = this;

			setTimeout(function () {
				_this2.hidden = true;
			}, this.speed);
			_tween2.default.to(this, {
				shiftX: this.direction.x,
				shiftY: this.direction.y,
				ease: 'expoOut',
				duration: this.speed
			});
		}
	}, {
		key: 'render',
		value: function render(ctx) {
			var x = this.grid.x(this.x);
			var y = this.grid.y(this.y);
			var size = this.grid.blocks(this.size);
			var radius = size / 2;
			var shiftX = this.shiftX * size;
			var shiftY = this.shiftY * size;
			var isWide = this.rotation % Math.PI === 0;

			ctx.save();
			ctx.translate(x, y);
			ctx.beginPath();
			ctx.rect(0, 0, isWide ? size : radius, isWide ? radius : size);
			ctx.closePath();
			ctx.clip();
			ctx.beginPath();
			ctx.arc(shiftX, radius + shiftY, radius, this.rotation, _constants.PI + this.rotation, true);
			ctx.closePath();
			ctx.fillStyle = this.fill;
			ctx.fill();
			ctx.restore();
		}
	}]);

	return Circle;
}(_abstract2.default);

exports.default = Circle;

},{"../constants":62,"../helpers/tween":66,"./abstract":68,"random-int":50}],71:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _tween = require('../helpers/tween');

var _tween2 = _interopRequireDefault(_tween);

var _abstract = require('./abstract');

var _abstract2 = _interopRequireDefault(_abstract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Square = function (_AbstractShape) {
	_inherits(Square, _AbstractShape);

	function Square(grid, x, y, size, opts) {
		_classCallCheck(this, Square);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Square).call(this, opts));

		_this.grid = grid;
		_this.x = x;
		_this.y = y;
		_this.size = size;
		return _this;
	}

	_createClass(Square, [{
		key: 'show',
		value: function show() {
			_tween2.default.to(this, {
				shiftX: 0.0,
				shiftY: 0.0,
				ease: 'expoOut',
				duration: this.speed
			});
		}
	}, {
		key: 'hide',
		value: function hide() {
			var _this2 = this;

			setTimeout(function () {
				_this2.hidden = true;
			}, this.speed);
			_tween2.default.to(this, {
				shiftX: this.direction.x,
				shiftY: this.direction.y,
				ease: 'expoOut',
				duration: this.speed
			});
		}
	}, {
		key: 'render',
		value: function render(ctx) {
			var x = this.grid.x(this.x);
			var y = this.grid.y(this.y);
			var size = this.grid.blocks(this.size);
			var shiftX = this.shiftX * size;
			var shiftY = this.shiftY * size;

			ctx.save();
			ctx.translate(x, y);
			ctx.beginPath();
			ctx.rect(0, 0, size, size);
			ctx.closePath();
			ctx.clip();
			ctx.beginPath();
			ctx.rect(shiftX, shiftY, size, size);
			ctx.closePath();
			ctx.fillStyle = this.fill;
			ctx.fill();
			ctx.restore();
		}
	}]);

	return Square;
}(_abstract2.default);

exports.default = Square;

},{"../helpers/tween":66,"./abstract":68}],72:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _tween = require('../helpers/tween');

var _tween2 = _interopRequireDefault(_tween);

var _abstract = require('./abstract');

var _abstract2 = _interopRequireDefault(_abstract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Triangle = function (_AbstractShape) {
	_inherits(Triangle, _AbstractShape);

	function Triangle(grid, x, y, size, opts) {
		_classCallCheck(this, Triangle);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Triangle).call(this, opts));

		_this.grid = grid;
		_this.x = x;
		_this.y = y;
		_this.size = size;
		return _this;
	}

	_createClass(Triangle, [{
		key: 'show',
		value: function show() {
			_tween2.default.to(this, {
				shiftX: 0,
				shiftY: 0,
				ease: 'expoOut',
				duration: this.speed
			});
		}
	}, {
		key: 'hide',
		value: function hide(fn) {
			var _this2 = this;

			setTimeout(function () {
				_this2.hidden = true;
			}, this.speed);
			_tween2.default.to(this, {
				shiftX: this.direction.x,
				shiftY: this.direction.y,
				ease: 'expoOut',
				duration: this.speed
			});
		}
	}, {
		key: 'render',
		value: function render(ctx) {
			var x = this.grid.x(this.x);
			var y = this.grid.y(this.y);
			var size = this.grid.blocks(this.size);
			var shiftX = this.shiftX * size;
			var shiftY = this.shiftY * size;

			ctx.save();
			ctx.beginPath();
			ctx.rect(x, y, size, size);
			ctx.closePath();
			ctx.clip();
			ctx.beginPath();
			ctx.translate(x + shiftX, y + shiftY);
			ctx.moveTo(0, 0);
			ctx.lineTo(size, size);
			ctx.lineTo(0, size);
			ctx.lineTo(0, 0);
			ctx.closePath();
			ctx.fillStyle = this.fill;
			ctx.fill();
			ctx.restore();
		}
	}]);

	return Triangle;
}(_abstract2.default);

exports.default = Triangle;

},{"../helpers/tween":66,"./abstract":68}],73:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],74:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[61]);
