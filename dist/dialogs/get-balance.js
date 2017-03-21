'use strict';

var _bot = require('../controllers/bot');

var _bot2 = _interopRequireDefault(_bot);

var _profile = require('./profile');

var _profile2 = _interopRequireDefault(_profile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bot2.default.dialog('/get-balance', [_profile2.default, function (session) {
  session.message.utu.event('Get Balance');
  session.send('Your current balance is $%s!', session.message.ctx.user.balance);
}]).triggerAction({ matches: /(get|see|view|show).*balance/i });