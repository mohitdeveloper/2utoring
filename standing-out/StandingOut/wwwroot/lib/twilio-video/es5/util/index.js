'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var constants = require('./constants');
var E = constants.typeErrors,
    trackPriority = constants.trackPriority;

var util = require('@twilio/webrtc/lib/util');

/**
 * Return the given {@link LocalTrack} or a new {@link LocalTrack} for the
 * given MediaStreamTrack.
 * @param {LocalTrack|MediaStreamTrack} track
 * @param {object} options
 * @returns {LocalTrack}
 * @throws {TypeError}
 */
function asLocalTrack(track, options) {
  if (track instanceof options.LocalAudioTrack || track instanceof options.LocalVideoTrack || track instanceof options.LocalDataTrack) {
    return track;
  }
  if (track instanceof options.MediaStreamTrack) {
    return track.kind === 'audio' ? new options.LocalAudioTrack(track, options) : new options.LocalVideoTrack(track, options);
  }
  /* eslint new-cap:0 */
  throw E.INVALID_TYPE('track', 'LocalAudioTrack, LocalVideoTrack, LocalDataTrack, or MediaStreamTrack');
}

/**
 * Create a new {@link LocalTrackPublication} for the given {@link LocalTrack}.
 * @param {LocalTrack} track
 * @param {LocalTrackPublicationSignaling} signaling
 * @param {function(track: LocalTrackPublication): void} unpublish
 * @param {object} options
 */
function asLocalTrackPublication(track, signaling, unpublish, options) {
  var LocalTrackPublication = {
    audio: options.LocalAudioTrackPublication,
    video: options.LocalVideoTrackPublication,
    data: options.LocalDataTrackPublication
  }[track.kind];
  return new LocalTrackPublication(signaling, track, unpublish, options);
}

/**
 * Capitalize a word.
 * @param {string} word
 * @returns {string} capitalized
 */
function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1);
}

/**
 * Log deprecation warnings for the given events of an EventEmitter.
 * @param {string} name
 * @param {EventEmitter} emitter
 * @param {Map<string, string>} events
 * @param {Log} log
 */
function deprecateEvents(name, emitter, events, log) {
  var warningsShown = new Set();
  emitter.on('newListener', function newListener(event) {
    if (events.has(event) && !warningsShown.has(event)) {
      log.deprecated(name + '#' + event + ' has been deprecated and scheduled for removal in twilio-video.js@2.0.0.' + (events.get(event) ? ' Use ' + name + '#' + events.get(event) + ' instead.' : ''));
      warningsShown.add(event);
    }
    if (warningsShown.size >= events.size) {
      emitter.removeListener('newListener', newListener);
    }
  });
}

/**
 * Finds the items in list1 that are not in list2.
 * @param {Array<*>|Map<*>|Set<*>} list1
 * @param {Array<*>|Map<*>|Set<*>} list2
 * @returns {Set}
 */
function difference(list1, list2) {
  list1 = Array.isArray(list1) ? new Set(list1) : new Set(list1.values());
  list2 = Array.isArray(list2) ? new Set(list2) : new Set(list2.values());

  var difference = new Set();

  list1.forEach(function (item) {
    if (!list2.has(item)) {
      difference.add(item);
    }
  });

  return difference;
}

/**
 * Filter out the keys in an object with a given value.
 * @param {object} object - Object to be filtered
 * @param {*} [filterValue] - Value to be filtered out; If not specified, then
 *   filters out all keys which have an explicit value of "undefined"
 * @returns {object} - Filtered object
 */
function filterObject(object, filterValue) {
  return Object.keys(object).reduce(function (filtered, key) {
    if (object[key] !== filterValue) {
      filtered[key] = object[key];
    }
    return filtered;
  }, {});
}

/**
 * Map a list to an array of arrays, and return the flattened result.
 * @param {Array<*>|Set<*>|Map<*>} list
 * @param {function(*): Array<*>} [mapFn]
 * @returns Array<*>
 */
function flatMap(list, mapFn) {
  var listArray = list instanceof Map || list instanceof Set ? Array.from(list.values()) : list;

  mapFn = mapFn || function mapFn(item) {
    return item;
  };

  return listArray.reduce(function (flattened, item) {
    var mapped = mapFn(item);
    return flattened.concat(mapped);
  }, []);
}

/**
 * Get the user agent string, or return "Unknown".
 * @returns {string}
 */
function getUserAgent() {
  return typeof navigator !== 'undefined' && navigator.userAgent ? navigator.userAgent : 'Unknown';
}

/**
 * Create a unique identifier.
 * @returns {string}
 */
function makeUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

/**
 * Ensure that the given function is called once per tick.
 * @param {function} fn - Function to be executed
 * @returns {function} - Schedules the given function to be called on the next tick
 */
function oncePerTick(fn) {
  var timeout = null;

  function nextTick() {
    timeout = null;
    fn();
  }

  return function scheduleNextTick() {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(nextTick);
  };
}

function promiseFromEvents(operation, eventEmitter, successEvent, failureEvent) {
  return new Promise(function (resolve, reject) {
    function onSuccess() {
      var args = [].slice.call(arguments);
      if (failureEvent) {
        eventEmitter.removeListener(failureEvent, onFailure);
      }
      resolve.apply(undefined, _toConsumableArray(args));
    }
    function onFailure() {
      var args = [].slice.call(arguments);
      eventEmitter.removeListener(successEvent, onSuccess);
      reject.apply(undefined, _toConsumableArray(args));
    }
    eventEmitter.once(successEvent, onSuccess);
    if (failureEvent) {
      eventEmitter.once(failureEvent, onFailure);
    }
    operation();
  });
}

/**
 * Traverse down multiple nodes on an object and return null if
 * any link in the path is unavailable.
 * @param {Object} obj - Object to traverse
 * @param {String} path - Path to traverse. Period-separated.
 * @returns {Any|null}
 */
function getOrNull(obj, path) {
  return path.split('.').reduce(function (output, step) {
    if (!output) {
      return null;
    }
    return output[step];
  }, obj);
}

/**
 * @typedef {object} Deferred
 * @property {Promise} promise
 * @property {function} reject
 * @property {function} resolve
 */

/**
 * Create a {@link Deferred}.
 * @returns {Deferred}
 */
function defer() {
  var deferred = {};
  deferred.promise = new Promise(function (resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
}

/**
 * Copy a method from a `source` prototype onto a `wrapper` prototype. Invoking
 * the method on the `wrapper` prototype will invoke the corresponding method
 * on an instance accessed by `target`.
 * @param {object} source
 * @param {object} wrapper
 * @param {string} target
 * @param {string} methodName
 * @returns {undefined}
 */
function delegateMethod(source, wrapper, target, methodName) {
  if (methodName in wrapper) {
    // Skip any methods already set.
    return;
  } else if (methodName.match(/^on[a-z]+$/)) {
    // Skip EventHandlers (these are handled in the constructor).
    return;
  }

  var type = void 0;
  try {
    type = _typeof(source[methodName]);
  } catch (error) {
    // NOTE(mroberts): Attempting to check the type of non-function members
    // on the prototype throws an error for some types.
  }

  if (type !== 'function') {
    // Skip non-function members.
    return;
  }

  /* eslint no-loop-func:0 */
  wrapper[methodName] = function () {
    var _target;

    return (_target = this[target])[methodName].apply(_target, arguments);
  };
}

/**
 * Copy methods from a `source` prototype onto a `wrapper` prototype. Invoking
 * the methods on the `wrapper` prototype will invoke the corresponding method
 * on an instance accessed by `target`.
 * @param {object} source
 * @param {object} wrapper
 * @param {string} target
 * @returns {undefined}
 */
function delegateMethods(source, wrapper, target) {
  for (var methodName in source) {
    delegateMethod(source, wrapper, target, methodName);
  }
}

/**
 * Determine whether two values are deeply equal.
 * @param {*} val1
 * @param {*} val2
 * @returns {boolean}
 */
function isDeepEqual(val1, val2) {
  if (val1 === val2) {
    return true;
  }
  if ((typeof val1 === 'undefined' ? 'undefined' : _typeof(val1)) !== (typeof val2 === 'undefined' ? 'undefined' : _typeof(val2))) {
    return false;
  }
  if (val1 === null) {
    return val2 === null;
  }
  if (val2 === null) {
    return false;
  }
  if (Array.isArray(val1)) {
    return Array.isArray(val2) && val1.length === val2.length && val1.every(function (val, i) {
      return isDeepEqual(val, val2[i]);
    });
  }
  if ((typeof val1 === 'undefined' ? 'undefined' : _typeof(val1)) === 'object') {
    var val1Keys = Object.keys(val1).sort();
    var val2Keys = Object.keys(val2).sort();
    return !Array.isArray(val2) && isDeepEqual(val1Keys, val2Keys) && val1Keys.every(function (key) {
      return isDeepEqual(val1[key], val2[key]);
    });
  }
  return false;
}

/**
 * Whether the given argument is a non-array object.
 * @param {*} object
 * @return {boolean}
 */
function isNonArrayObject(object) {
  return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && !Array.isArray(object);
}

/**
 * For each property name on the `source` prototype, add getters and/or setters
 * to `wrapper` that proxy to `target`.
 * @param {object} source
 * @param {object} wrapper
 * @param {string} target
 * @returns {undefined}
 */
function proxyProperties(source, wrapper, target) {
  Object.getOwnPropertyNames(source).forEach(function (propertyName) {
    proxyProperty(source, wrapper, target, propertyName);
  });
}

/**
 * For the property name on the `source` prototype, add a getter and/or setter
 * to `wrapper` that proxies to `target`.
 * @param {object} source
 * @param {object} wrapper
 * @param {string} target
 * @param {string} propertyName
 * @returns {undefined}
 */
function proxyProperty(source, wrapper, target, propertyName) {
  if (propertyName in wrapper) {
    // Skip any properties already set.
    return;
  } else if (propertyName.match(/^on[a-z]+$/)) {
    Object.defineProperty(wrapper, propertyName, {
      value: null,
      writable: true
    });

    target.addEventListener(propertyName.slice(2), function () {
      wrapper.dispatchEvent.apply(wrapper, arguments);
    });

    return;
  }

  Object.defineProperty(wrapper, propertyName, {
    enumerable: true,
    get: function get() {
      return target[propertyName];
    }
  });
}

/**
 * This is a function for turning a Promise into the kind referenced in the
 * Legacy Interface Extensions section of the WebRTC spec.
 * @param {Promise<*>} promise
 * @param {function<*>} onSuccess
 * @param {function<Error>} onFailure
 * @returns {Promise<undefined>}
 */
function legacyPromise(promise, onSuccess, onFailure) {
  if (onSuccess) {
    return promise.then(function (result) {
      onSuccess(result);
    }, function (error) {
      onFailure(error);
    });
  }
  return promise;
}

/**
 * Build the {@link LogLevels} object.
 * @param {String|LogLevel} logLevel - Log level name or object
 * @returns {LogLevels}
 */
function buildLogLevels(logLevel) {
  if (typeof logLevel === 'string') {
    return {
      default: logLevel,
      media: logLevel,
      signaling: logLevel,
      webrtc: logLevel
    };
  }
  return logLevel;
}

/**
 * Get the {@link Track}'s derived class name
 * @param {Track} track
 * @param {?boolean} [local=undefined]
 * @returns {string}
 */
function trackClass(track, local) {
  local = local ? 'Local' : '';
  return local + (track.kind || '').replace(/\w{1}/, function (m) {
    return m.toUpperCase();
  }) + 'Track';
}

/**
 * Get the {@link TrackPublication}'s derived class name
 * @param {TrackPublication} publication
 * @param {?boolean} [local=undefined]
 * @returns {string}
 */
function trackPublicationClass(publication, local) {
  local = local ? 'Local' : '';
  return local + (publication.kind || '').replace(/\w{1}/, function (m) {
    return m.toUpperCase();
  }) + 'TrackPublication';
}

/**
 * Sets all underscore-prefixed properties on `object` non-enumerable.
 * @param {Object} object
 * @returns {void}
 */
function hidePrivateProperties(object) {
  Object.getOwnPropertyNames(object).forEach(function (name) {
    if (name.startsWith('_')) {
      hideProperty(object, name);
    }
  });
}

/**
 * Creates a new subclass which, in the constructor, sets all underscore-prefixed
 * properties and the given public properties non-enumerable. This is useful for
 * patching up classes like EventEmitter which may set properties like `_events`
 * and `domain`.
 * @param {Function} klass
 * @param {Array<string>} props
 * @returns {Function} subclass
 */
function hidePrivateAndCertainPublicPropertiesInClass(klass, props) {
  // NOTE(mroberts): We do this to avoid giving the class a name.
  return function (_klass) {
    _inherits(_class, _klass);

    function _class() {
      var _ref;

      _classCallCheck(this, _class);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args)));

      hidePrivateProperties(_this);
      hidePublicProperties(_this, props);
      return _this;
    }

    return _class;
  }(klass);
}

/**
 * Hide a property of an object.
 * @param {object} object
 * @param {string} name
 */
function hideProperty(object, name) {
  var descriptor = Object.getOwnPropertyDescriptor(object, name);
  descriptor.enumerable = false;
  Object.defineProperty(object, name, descriptor);
}

/**
 * Hide the given public properties of an object.
 * @param {object} object
 * @param {Array<string>} [props=[]]
 */
function hidePublicProperties(object) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  props.forEach(function (name) {
    // eslint-disable-next-line no-prototype-builtins
    if (object.hasOwnProperty(name)) {
      hideProperty(object, name);
    }
  });
}

/**
 * Convert an Array of values to an Array of JSON values by calling
 * `valueToJSON` on each value.
 * @param {Array<*>} array
 * @returns {Array<*>}
 */
function arrayToJSON(array) {
  return array.map(valueToJSON);
}

/**
 * Convert a Set of values to an Array of JSON values by calling `valueToJSON`
 * on each value.
 * @param {Set<*>} set
 * @returns {Array<*>}
 */
function setToJSON(set) {
  return arrayToJSON([].concat(_toConsumableArray(set)));
}

/**
 * Convert a Map from strings to values to an object of JSON values by calling
 * `valueToJSON` on each value.
 * @param {Map<string, *>} map
 * @returns {object}
 */
function mapToJSON(map) {
  return [].concat(_toConsumableArray(map.entries())).reduce(function (json, _ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        key = _ref3[0],
        value = _ref3[1];

    return Object.assign(_defineProperty({}, key, valueToJSON(value)), json);
  }, {});
}

/**
 * Convert an object to a JSON value by calling `valueToJSON` on its enumerable
 * keys.
 * @param {object} object
 * @returns {object}
 */
function objectToJSON(object) {
  return Object.entries(object).reduce(function (json, _ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
        key = _ref5[0],
        value = _ref5[1];

    return Object.assign(_defineProperty({}, key, valueToJSON(value)), json);
  }, {});
}

/**
 * Convert a value into a JSON value.
 * @param {*} value
 * @returns {*}
 */
function valueToJSON(value) {
  if (Array.isArray(value)) {
    return arrayToJSON(value);
  } else if (value instanceof Set) {
    return setToJSON(value);
  } else if (value instanceof Map) {
    return mapToJSON(value);
  } else if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
    return objectToJSON(value);
  }
  return value;
}

/**
 * Create the bandwidth profile payload included in an RSP connect message.
 * @param {BandwidthProfileOptions} bandwidthProfile
 * @returns {object}
 */
function createBandwidthProfilePayload(bandwidthProfile) {
  return createRSPPayload(bandwidthProfile, [{ prop: 'video', type: 'object', transform: createBandwidthProfileVideoPayload }]);
}

/**
 * Create the bandwidth profile video payload included in an RSP connect message.
 * @param {VideoBandwidthProfileOptions} bandwidthProfileVideo
 * @returns {object}
 */
function createBandwidthProfileVideoPayload(bandwidthProfileVideo) {
  return createRSPPayload(bandwidthProfileVideo, [{ prop: 'dominantSpeakerPriority', type: 'string', payloadProp: 'active_speaker_priority' }, { prop: 'maxSubscriptionBitrate', type: 'number', payloadProp: 'max_subscription_bandwidth' }, { prop: 'maxTracks', type: 'number', payloadProp: 'max_tracks' }, { prop: 'mode', type: 'string' }, { prop: 'renderDimensions', type: 'object', payloadProp: 'render_dimensions', transform: createRenderDimensionsPayload }, { prop: 'trackSwitchOffMode', type: 'string', payloadProp: 'track_switch_off' }]);
}

/**
 * Create the Media Signaling payload included in an RSP connect message.
 * @param {boolean} dominantSpeaker - whether to enable the Dominant Speaker
 *   protocol or not
 * @param {boolean} networkQuality - whether to enable the Network Quality
 *   protocol or not
 * @param {boolean} trackPriority - whether to enable the Track Priority
 *   protocol or not
 * @param {boolean} trackSwitchOff - whether to enable the Track Switch-Off
 *   protocol or not.
 * @returns {object}
 */
function createMediaSignalingPayload(dominantSpeaker, networkQuality, trackPriority, trackSwitchOff) {
  var transports = { transports: [{ type: 'data-channel' }] };
  return Object.assign(dominantSpeaker
  // eslint-disable-next-line
  ? { active_speaker: transports } : {}, networkQuality
  // eslint-disable-next-line
  ? { network_quality: transports } : {}, trackPriority
  // eslint-disable-next-line
  ? { track_priority: transports } : {}, trackSwitchOff
  // eslint-disable-next-line
  ? { track_switch_off: transports } : {});
}

/**
 * Create {@link VideoTrack.Dimensions} RSP payload.
 * @param {VideoTrack.Dimensions} [dimensions]
 * @returns {object}
 */
function createDimensionsPayload(dimensions) {
  return createRSPPayload(dimensions, [{ prop: 'height', type: 'number' }, { prop: 'width', type: 'number' }]);
}

/**
 * Create {@link VideoRenderDimensions} RSP payload.
 * @param renderDimensions
 * @returns {object}
 */
function createRenderDimensionsPayload(renderDimensions) {
  var PRIORITY_HIGH = trackPriority.PRIORITY_HIGH,
      PRIORITY_LOW = trackPriority.PRIORITY_LOW,
      PRIORITY_STANDARD = trackPriority.PRIORITY_STANDARD;

  return createRSPPayload(renderDimensions, [{ prop: PRIORITY_HIGH, type: 'object', transform: createDimensionsPayload }, { prop: PRIORITY_LOW, type: 'object', transform: createDimensionsPayload }, { prop: PRIORITY_STANDARD, type: 'object', transform: createDimensionsPayload }]);
}

/**
 * Create an RSP payload for the given object.
 * @param {object} object - object for which RSP payload is to be generated
 * @param {Array<object>} propConversions - conversion rules for object properties;
 *   they specify how object properties should be converted to their corresponding
 *   RSP payload properties
 * @returns {object}
 */
function createRSPPayload(object, propConversions) {
  return propConversions.reduce(function (payload, _ref6) {
    var prop = _ref6.prop,
        type = _ref6.type,
        _ref6$payloadProp = _ref6.payloadProp,
        payloadProp = _ref6$payloadProp === undefined ? prop : _ref6$payloadProp,
        _ref6$transform = _ref6.transform,
        transform = _ref6$transform === undefined ? function (x) {
      return x;
    } : _ref6$transform;

    return _typeof(object[prop]) === type ? Object.assign(_defineProperty({}, payloadProp, transform(object[prop])), payload) : payload;
  }, {});
}

/**
 * Create the subscribe payload included in an RSP connect/update message.
 * @param {boolean} automaticSubscription - whether to subscribe to all RemoteTracks
 * @returns {object}
 */
function createSubscribePayload(automaticSubscription) {
  return {
    rules: [{
      type: automaticSubscription ? 'include' : 'exclude',
      all: true
    }],
    revision: 1
  };
}

/**
 * Add random jitter to a given value in the range [-jitter, jitter].
 * @private
 * @param {number} value
 * @param {number} jitter
 * @returns {number} value + random(-jitter, +jitter)
 */
function withJitter(value, jitter) {
  var rand = Math.random();
  return value - jitter + Math.floor(2 * jitter * rand + 0.5);
}

/**
 * Checks if the a number is in the range [min, max].
 * @private
 * @param {num} num
 * @param {number} min
 * @param {number} max
 * @return {boolean}
 */
function inRange(num, min, max) {
  return min <= num && num <= max;
}

/**
 * returns true if given MediaStreamTrack is a screen share track
 * @private
 * @param {MediaStreamTrack} track
 * @returns {boolean}
 */
function isChromeScreenShareTrack(track) {
  // NOTE(mpatwardhan): Chrome creates screen share tracks with label like: "screen:69734272*"
  // we will check for label that starts with "screen:D" where D being a digit.
  var isChrome = util.guessBrowser() === 'chrome';
  return isChrome && track.kind === 'video' && track.label && (/^screen:[0-9]+/.test(track.label) || /^web-contents-media-stream:[0-9/]+/.test(track.label) || /^window:[0-9]+/.test(track.label));
}

/**
 * Returns a promise that resolve after timeoutMS have passed.
 * @param {number} timeoutMS - time to wait in milliseconds.
 * @returns {Promise<void>}
 */
function waitForSometime() {
  var timeoutMS = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

  return new Promise(function (resolve) {
    return setTimeout(resolve, timeoutMS);
  });
}

/**
 * Returns a promise that resolve after event is received
 * @returns {Promise<void>}
 */
function waitForEvent(eventTarget, event) {
  return new Promise(function (resolve) {
    eventTarget.addEventListener(event, function onevent(e) {
      eventTarget.removeEventListener(event, onevent);
      resolve(e);
    });
  });
}

exports.constants = constants;
exports.createBandwidthProfilePayload = createBandwidthProfilePayload;
exports.createMediaSignalingPayload = createMediaSignalingPayload;
exports.createSubscribePayload = createSubscribePayload;
exports.asLocalTrack = asLocalTrack;
exports.asLocalTrackPublication = asLocalTrackPublication;
exports.capitalize = capitalize;
exports.deprecateEvents = deprecateEvents;
exports.difference = difference;
exports.filterObject = filterObject;
exports.flatMap = flatMap;
exports.getUserAgent = getUserAgent;
exports.hidePrivateProperties = hidePrivateProperties;
exports.hidePrivateAndCertainPublicPropertiesInClass = hidePrivateAndCertainPublicPropertiesInClass;
exports.isDeepEqual = isDeepEqual;
exports.isNonArrayObject = isNonArrayObject;
exports.inRange = inRange;
exports.makeUUID = makeUUID;
exports.oncePerTick = oncePerTick;
exports.promiseFromEvents = promiseFromEvents;
exports.getOrNull = getOrNull;
exports.defer = defer;
exports.delegateMethods = delegateMethods;
exports.proxyProperties = proxyProperties;
exports.legacyPromise = legacyPromise;
exports.buildLogLevels = buildLogLevels;
exports.trackClass = trackClass;
exports.trackPublicationClass = trackPublicationClass;
exports.valueToJSON = valueToJSON;
exports.withJitter = withJitter;
exports.isChromeScreenShareTrack = isChromeScreenShareTrack;
exports.waitForSometime = waitForSometime;
exports.waitForEvent = waitForEvent;