'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  receive: function receive(message, next) {
    // create a new user object
    var user = new _user2.default(message.user.id);

    // assign a new user object to the message
    Object.assign(message, { ctx: { user: user } });

    // move on to the next middleware
    next();
  }
};