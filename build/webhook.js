'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_PORT = 5463; // LINE

var Webhook = function () {
  function Webhook(token) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var callback = arguments[2];
    var whCallback = arguments[3];

    _classCallCheck(this, Webhook);

    this.token = token;
    this.callback = callback;

    var app = (0, _express2.default)();
    app.use((0, _morgan2.default)('dev'));
    app.use(_bodyParser2.default.json());
    app.post('/', this._parseBody.bind(this));
    app.use(function (err, req, res, next) {
      res.status(500).send(err);
    });
    this._webserver = app;
    var APP_PORT = opts.port || DEFAULT_PORT;
    this._webserver.listen(APP_PORT, function (err) {
      if (!err) whCallback(APP_PORT);
    }).on('error', function (err) {
      console.error(err);
    });
  }

  _createClass(Webhook, [{
    key: '_parseBody',
    value: function _parseBody(req, res, next) {
      var events = req.body && req.body.events;
      if (events) {
        // console.log(this)
        res.send('OK');
        return this.callback(events);
      } else {
        next('no events found');
        return null;
      }
    }
  }]);

  return Webhook;
}();

exports.default = Webhook;