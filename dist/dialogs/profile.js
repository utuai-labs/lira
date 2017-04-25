'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _botbuilder = require('botbuilder');

var _botbuilder2 = _interopRequireDefault(_botbuilder);

var _bot = require('../controllers/bot');

var _bot2 = _interopRequireDefault(_bot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A waterfall dialog function that will verify if a users profile
 * is setup or not. if it is not then it will trigger the `/profile`
 * dialog to kick in before continuing on the original dialog
 * @param  {Object}   session botbuilder session
 * @param  {Object}   args    context passed into the dialog
 * @param  {Function} next    middleware like next function to continue to the next waterfall
 */
var verifyUserProfile = function verifyUserProfile(session, args, next) {
  if (!session.message.ctx.user.isSetup()) {
    session.beginDialog('/profile');
  } else {
    next();
  }
};

_bot2.default.dialog('/', [verifyUserProfile, function (session) {
  session.send('\n        Hello, ' + session.message.ctx.user.firstName + ',\n        There a few commands that you can ask me:\n        - can i buy (something)\n        - get balance\n        - set balance\n        - update name\n      ');
}]);

_bot2.default.dialog('/profile/name', [function (session) {
  session.message.utu.event('Update Profile Name');
  _botbuilder2.default.Prompts.text(session, 'Okay great! let\'s update your name. What is your first name?');
}, function (session, results) {
  if (results.response) {
    session.message.ctx.user.setFirstName(results.response);
  }

  _botbuilder2.default.Prompts.text(session, 'What is your last name?');
}, function (session, results) {
  if (results.response) {
    session.message.ctx.user.setLastName(results.response);
  }
  var _session$message$ctx$ = session.message.ctx.user,
      firstName = _session$message$ctx$.firstName,
      lastName = _session$message$ctx$.lastName;


  session.message.utu.user({ values: { firstName: firstName, lastName: lastName } });

  session.send('Alright, you should be good to go! I\'ll now call you ' + firstName + ' ' + lastName);
  session.endDialog();
}]).triggerAction({ matches: /(change|set|update).*name/i });

_bot2.default.dialog('/profile', [function (session, args, next) {
  session.message.utu.event('Setup Profile');
  if (!session.message.ctx.user.firstName) {
    _botbuilder2.default.Prompts.text(session, 'Hi, I just need to collect a few pieces of information from you since this is our first time talking! What is your first name?');
    session.message.utu.intent('initial-setup').catch(function (e) {
      return console.log(e);
    });
  } else {
    next();
  }
}, function (session, results, next) {
  if (results.response) {
    session.message.ctx.user.setFirstName(results.response);
  }

  if (!session.message.ctx.user.lastName) {
    _botbuilder2.default.Prompts.text(session, 'What is your last name?');
  } else {
    next();
  }
}, function (session, results, next) {
  if (results.response) {
    session.message.ctx.user.setLastName(results.response);
  }

  if (!session.message.ctx.user.email) {
    _botbuilder2.default.Prompts.text(session, 'What is your email?');
  } else {
    next();
  }
}, function (session, results, next) {
  if (results.response) {
    session.message.ctx.user.setEmail(results.response);
  }

  if (!session.message.ctx.user.balance) {
    _botbuilder2.default.Prompts.number(session, 'What is your starting balance?');
  } else {
    next();
  }
}, function (session, results) {
  if (results.response) {
    session.message.ctx.user.setBalance(results.response);
    session.message.ctx.user.setSetup();
  }

  // update the users information in utu
  session.message.utu.user({ values: session.message.ctx.user });
  session.message.utu.event('Profile Setup');
  session.endDialog();
}]);

exports.default = verifyUserProfile;