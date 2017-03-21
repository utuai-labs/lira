'use strict';

var _botbuilder = require('botbuilder');

var _botbuilder2 = _interopRequireDefault(_botbuilder);

var _bot = require('../controllers/bot');

var _bot2 = _interopRequireDefault(_bot);

var _profile = require('./profile');

var _profile2 = _interopRequireDefault(_profile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bot2.default.dialog('/set-balance', [_profile2.default, function (session) {
  session.message.utu.event('Set Balance');
  _botbuilder2.default.Prompts.number(session, 'What is your new balance?');
}, function (session, results) {
  if (results.response) {
    session.message.ctx.user.setBalance(results.response);
  }
  session.send('Your current balance is $%s!', session.message.ctx.user.balance);
  session.endDialog();
}]).triggerAction({ matches: /(set).*balance/i }).cancelAction('cancelItemAction', 'Okay, don\'t be afraid to ask again!', { matches: /(cancel|stop|nvm|quit)/i });