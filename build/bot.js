'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _webhook = require('./webhook');

var _webhook2 = _interopRequireDefault(_webhook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _eventTypes = ['message', 'follow', 'unfollow', 'join', 'leave', 'postback', 'beacon'];
var _messageTypes = ['text', 'image', 'video', 'audio', 'location', 'sticker'];
var _sourceTypes = ['user', 'group', 'room'];

var LineBot = function (_EventEmitter) {
  _inherits(LineBot, _EventEmitter);

  _createClass(LineBot, null, [{
    key: 'eventTypes',
    get: function get() {
      return _eventTypes;
    }
  }, {
    key: 'messageTypes',
    get: function get() {
      return _messageTypes;
    }
  }, {
    key: 'sourceTypes',
    get: function get() {
      return _sourceTypes;
    }
  }]);

  function LineBot(secret, token) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, LineBot);

    var _this = _possibleConstructorReturn(this, (LineBot.__proto__ || Object.getPrototypeOf(LineBot)).call(this));

    _this.secret = secret;
    _this.token = token;
    _this.options = options;
    _this._Webhook = new _webhook2.default(_this.token, _this.options.webhook, _this.processEvents.bind(_this), function (webhookStarted) {
      _this.emit('webhook', webhookStarted);
    });
    return _this;
  }

  _createClass(LineBot, [{
    key: 'request',
    value: function request(path) {
      return _axios2.default.get(path);
    }
  }, {
    key: 'processEvents',
    value: function processEvents(events) {
      this.emit('events', events);
      // `events` is a Webhook Event Object -- https://devdocs.line.me/en/#webhook-event-object
      // const processEventType = eventType => {
      //   if (event.type === eventType)
      // }
      // LineBot.eventTypes.forEach()
      events.forEach(this.parseOneEvent.bind(this));
    }
  }, {
    key: 'parseOneEvent',
    value: function parseOneEvent(event) {
      this.emit('event', event);
      switch (event.type) {
        case 'message':
          this.emit('message', event);
          break;
        case 'follow':
          this.emit('follow', event);
          break;
        case 'unfollow':
          this.emit('unfollow', event);
          break;
        case 'join':
          this.emit('join', event);
          break;
        case 'leave':
          this.emit('leave', event);
          break;
        case 'postback':
          this.emit('postback', event);
          break;
        case 'beacon':
          this.emit('beacon', event);
          break;
        default:
          break;
      }
    }
  }, {
    key: 'push',
    value: function push(channel, messages) {}
  }, {
    key: 'reply',
    value: function reply(replyToken, messages) {}
  }]);

  return LineBot;
}(_eventemitter2.default);

exports.default = LineBot;