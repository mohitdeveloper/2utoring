'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Track = require('./');

var _require = require('../../util/constants'),
    E = _require.typeErrors,
    trackPriority = _require.trackPriority;

/**
 * A {@link RemoteDataTrack} represents data published to a {@link Room} by a
 * {@link RemoteParticipant}.
 * @extends Track
 * @property {boolean} isEnabled - true
 * @property {boolean} isSubscribed - Whether the {@link RemoteDataTrack} is
 *   subscribed to
 * @property {boolean} isSwitchedOff - Whether the {@link RemoteDataTrack} is
 *   switched off
 * @property {Track.Kind} kind - "data"
 * @property {?number} maxPacketLifeTime - If non-null, this represents a time
 *   limit (in milliseconds) during which data will be transmitted or
 *   retransmitted if not acknowledged on the underlying RTCDataChannel.
 * @property {?number} maxRetransmits - If non-null, this represents the number
 *   of times the data will be retransmitted if not successfully received on the
 *   underlying RTCDataChannel.
 * @property {boolean} ordered - true if data on the {@link RemoteDataTrack} can
 *   be received out-of-order.
 * @property {?Track.Priority} priority - The subscribe priority of the {@link RemoteDataTrack}
 * @property {boolean} reliable - This is true if both
 *   <code>maxPacketLifeTime</code> and <code>maxRetransmits</code> are set to
 *   null. In other words, if this is true, there is no bound on packet lifetime
 *   or the number of retransmits that will be attempted, ensuring "reliable"
 *   transmission.
 * @property {Track.SID} sid - The SID assigned to the {@link RemoteDataTrack}
 * @emits RemoteDataTrack#message
 * @emits RemoteDataTrack#switchedOff
 * @emits RemoteDataTrack#switchedOn
 */


var RemoteDataTrack = function (_Track) {
  _inherits(RemoteDataTrack, _Track);

  /**
   * Construct a {@link RemoteDataTrack} from a {@link DataTrackReceiver}.
   * @param {Track.SID} sid
   * @param {DataTrackReceiver} dataTrackReceiver
   * @param {{log: Log, name: ?string}} options
   */
  function RemoteDataTrack(sid, dataTrackReceiver, options) {
    _classCallCheck(this, RemoteDataTrack);

    var _this = _possibleConstructorReturn(this, (RemoteDataTrack.__proto__ || Object.getPrototypeOf(RemoteDataTrack)).call(this, dataTrackReceiver.id, 'data', options));

    Object.defineProperties(_this, {
      _isSwitchedOff: {
        value: false,
        writable: true
      },
      _priority: {
        value: null,
        writable: true
      },
      isEnabled: {
        enumerable: true,
        value: true
      },
      isSwitchedOff: {
        enumerable: true,
        get: function get() {
          return this._isSwitchedOff;
        }
      },
      maxPacketLifeTime: {
        enumerable: true,
        value: dataTrackReceiver.maxPacketLifeTime
      },
      maxRetransmits: {
        enumerable: true,
        value: dataTrackReceiver.maxRetransmits
      },
      ordered: {
        enumerable: true,
        value: dataTrackReceiver.ordered
      },
      priority: {
        enumerable: true,
        get: function get() {
          return this._priority;
        }
      },
      reliable: {
        enumerable: true,
        value: dataTrackReceiver.maxPacketLifeTime === null && dataTrackReceiver.maxRetransmits === null
      },
      sid: {
        enumerable: true,
        value: sid
      }
    });

    dataTrackReceiver.on('message', function (data) {
      _this.emit('message', data, _this);
    });
    return _this;
  }

  /**
   * Update the subscriber {@link Track.Priority} of the {@link RemoteDataTrack}.
   * @param {?Track.Priority} priority - the new {@link Track.priority};
   *   Currently setPriority has no effect on data tracks.
   * @returns {this}
   * @throws {RangeError}
   */


  _createClass(RemoteDataTrack, [{
    key: 'setPriority',
    value: function setPriority(priority) {
      var priorityValues = [null].concat(_toConsumableArray(Object.values(trackPriority)));
      if (!priorityValues.includes(priority)) {
        // eslint-disable-next-line new-cap
        throw E.INVALID_VALUE('priority', priorityValues);
      }

      // Note: priority has no real effect on the data tracks.
      this._priority = priority;
      return this;
    }

    /**
     * @private
     */

  }, {
    key: '_setEnabled',
    value: function _setEnabled() {}
    // Do nothing.


    /**
     * @private
     * @param {boolean} isSwitchedOff
     */

  }, {
    key: '_setSwitchedOff',
    value: function _setSwitchedOff(isSwitchedOff) {
      if (this._isSwitchedOff !== isSwitchedOff) {
        this._isSwitchedOff = isSwitchedOff;
        this.emit(isSwitchedOff ? 'switchedOff' : 'switchedOn', this);
      }
    }
  }]);

  return RemoteDataTrack;
}(Track);

/**
 * A message was received over the {@link RemoteDataTrack}.
 * @event RemoteDataTrack#message
 * @param {string|ArrayBuffer} data
 * @param {RemoteDataTrack} track - The {@link RemoteDataTrack} that received
 *   the message
 */

/**
 * A {@link RemoteDataTrack} was switched off.
 * @param {RemoteDataTrack} track - The {@link RemoteDataTrack} that was
 *   switched off
 * @event RemoteDataTrack#switchedOff
 */

/**
 * A {@link RemoteDataTrack} was switched on.
 * @param {RemoteDataTrack} track - The {@link RemoteDataTrack} that was
 *   switched on
 * @event RemoteDataTrack#switchedOn
 */

module.exports = RemoteDataTrack;