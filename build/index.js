'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bot = require('./bot');

var _bot2 = _interopRequireDefault(_bot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
// let bot = new Bot('secret', 'token')
// // bot.on('msg', msg => console.log(msg))
// // console.log(bot)
// bot.on('webhook', w => console.log(`bot listens on port ${w}.`))
// bot.on('events', e => console.dir(e))
// bot.on('message', m => console.log(`incoming message: ${m}`))

exports.default = _bot2.default;