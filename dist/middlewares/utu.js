'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.send = exports.utu = undefined;

var _utu = require('utu');

var UTU_SECRET = process.env.UTU_SECRET;


var platformMatrix = {
  sms: _utu.constants.SMS,
  facebook: _utu.constants.MESSENGER,
  kik: _utu.constants.kik
};

var mapPlatformToUTUNames = function mapPlatformToUTUNames(platform) {
  return platformMatrix[platform] || platformMatrix.kik;
};

// create our utu client
var utu = exports.utu = new _utu.uTu(UTU_SECRET);

exports.default = {
  receive: function receive(session, next) {
    var ctx = utu.withContext({
      platform: mapPlatformToUTUNames(session.address.channelId),
      platformId: session.user.id
    });

    ctx.message({
      values: {
        message: session.text,
        rawMessage: session.sourceEvent || session,
        botMessage: false
      }
    }).catch(function (e) {
      return console.log('UTU MSG Receive ERROR:', e);
    });

    Object.assign(session, { utu: ctx });

    next();
  },
  send: function send(session, next) {
    utu.message({
      platform: mapPlatformToUTUNames(session.address.channelId),
      platformId: session.address.id,
      values: {
        message: session.text || '',
        rawMessage: session,
        botMessage: true
      }
    }).catch(function (e) {
      return console.log(e);
    });
    next();
  }
};
var send = exports.send = function send(bot, message) {
  utu.message({
    platform: _utu.constants.MESSENGER,
    platformId: message.channel,
    sessionId: message.channel,
    values: {
      message: message.text || '',
      rawMessage: {
        text: message.text
      },
      botMessage: true
    }
  }).catch(function (e) {
    return console.log(e);
  });
};