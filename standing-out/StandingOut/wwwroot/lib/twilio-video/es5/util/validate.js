'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = require('./'),
    isNonArrayObject = _require.isNonArrayObject;

var _require2 = require('./constants'),
    E = _require2.typeErrors,
    subscriptionMode = _require2.subscriptionMode,
    trackPriority = _require2.trackPriority,
    trackSwitchOffMode = _require2.trackSwitchOffMode;

/**
 * Validate the {@link BandwidthProfileOptions} object.
 * @param {BandwidthProfileOptions} bandwidthProfile
 * @returns {?Error} - null if valid, Error if not.
 */


function validateBandwidthProfile(bandwidthProfile) {
  var error = validateObject(bandwidthProfile, 'options.bandwidthProfile');
  if (!bandwidthProfile || error) {
    return error;
  }
  error = validateObject(bandwidthProfile.video, 'options.bandwidthProfile.video', [{ prop: 'dominantSpeakerPriority', values: Object.values(trackPriority) }, { prop: 'maxSubscriptionBitrate', type: 'number' }, { prop: 'maxTracks', type: 'number' }, { prop: 'mode', values: Object.values(subscriptionMode) }, { prop: 'trackSwitchOffMode', values: Object.values(trackSwitchOffMode) }]);
  return error || (bandwidthProfile.video ? validateRenderDimensions(bandwidthProfile.video.renderDimensions) : null);
}

/**
 * Throw if the given track is not a {@link LocalAudioTrack}, a
 * {@link LocalVideoTrack} or a MediaStreamTrack.
 * @param {*} track
 * @param {object} options
 */
function validateLocalTrack(track, options) {
  if (!(track instanceof options.LocalAudioTrack || track instanceof options.LocalDataTrack || track instanceof options.LocalVideoTrack || track instanceof options.MediaStreamTrack)) {
    /* eslint new-cap:0 */
    throw E.INVALID_TYPE('track', 'LocalAudioTrack, LocalVideoTrack, LocalDataTrack, or MediaStreamTrack');
  }
}

/**
 * Validate an object. An object is valid if it is undefined or a non-null, non-array
 * object whose properties satisfy the specified data-type or value-range requirements.
 * @param {object} object - the object to be validated
 * @param {string} name - the object name to be used to build the error message, if invalid
 * @param {Array<object>} [propChecks] - optional data-type or value-range requirements
 *   for the object's properties
 * @returns {?Error} - null if object is valid, Error if not
 */
function validateObject(object, name) {
  var propChecks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  // NOTE(mmalavalli): We determine that an undefined object is valid because this
  // means the parent object does not contain this object as a property, which is
  // a valid scenario.
  if (typeof object === 'undefined') {
    return null;
  }
  // NOTE(mmalavalli): We determine that if the object is null, or an Array, or
  // any other non-object type, then it is invalid.
  if (object === null || !isNonArrayObject(object)) {
    return E.INVALID_TYPE(name, 'object');
  }
  // NOTE(mmalavalli): We determine that the object is invalid if at least one of
  // its properties does not satisfy its data-type or value-range requirement.
  return propChecks.reduce(function (error, _ref) {
    var prop = _ref.prop,
        type = _ref.type,
        values = _ref.values;

    if (error || !(prop in object)) {
      return error;
    }
    var value = object[prop];
    if (type && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== type) {
      return E.INVALID_TYPE(name + '.' + prop, type);
    }
    if (type === 'number' && isNaN(value)) {
      return E.INVALID_TYPE(name + '.' + prop, type);
    }
    if (Array.isArray(values) && !values.includes(value)) {
      return E.INVALID_VALUE(name + '.' + prop, values);
    }
    return error;
  }, null);
}

/**
 * Validate the {@link VideoRenderDimensions} object.
 * @param {VideoRenderDimensions} renderDimensions
 * @returns {?Error} - null if valid, Error if not.
 */
function validateRenderDimensions(renderDimensions) {
  var name = 'options.bandwidthProfile.video.renderDimensions';
  var error = validateObject(renderDimensions, name);
  return renderDimensions ? error || Object.values(trackPriority).reduce(function (error, prop) {
    return error || validateObject(renderDimensions[prop], name + '.' + prop, [{ prop: 'height', type: 'number' }, { prop: 'width', type: 'number' }]);
  }, null) : error;
}

exports.validateBandwidthProfile = validateBandwidthProfile;
exports.validateLocalTrack = validateLocalTrack;
exports.validateObject = validateObject;