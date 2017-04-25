'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _collections = require('../collections');

var _utu = require('../middlewares/utu');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = function () {
  function User(platformId) {
    (0, _classCallCheck3.default)(this, User);

    this.platformId = platformId;
    this.fetchUser();
  }

  (0, _createClass3.default)(User, [{
    key: 'fetchUser',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var user;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _collections.users.findOne({ _id: this.platformId });

              case 3:
                _context.t0 = _context.sent;

                if (_context.t0) {
                  _context.next = 6;
                  break;
                }

                _context.t0 = {};

              case 6:
                user = _context.t0;

                this.balance = user.balance || 0.00;
                this.firstName = user.firstName || '';
                this.lastName = user.lastName || '';
                this.email = user.email || '';
                this.setup = !!user.setup;
                _context.next = 17;
                break;

              case 14:
                _context.prev = 14;
                _context.t1 = _context['catch'](0);

                console.log(_context.t1);

              case 17:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 14]]);
      }));

      function fetchUser() {
        return _ref.apply(this, arguments);
      }

      return fetchUser;
    }()
  }, {
    key: 'update',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2($set) {
        var saved;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _collections.users.update({ _id: this.platformId }, { $set: $set }, { upsert: true });

              case 2:
                saved = _context2.sent;
                return _context2.abrupt('return', saved);

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function update(_x) {
        return _ref2.apply(this, arguments);
      }

      return update;
    }()
  }, {
    key: 'setBalance',
    value: function setBalance(balance) {
      this.balance = parseFloat(balance);
      return this.update({ balance: balance });
    }
  }, {
    key: 'setFirstName',
    value: function setFirstName(firstName) {
      this.firstName = firstName;
      return this.update({ firstName: firstName });
    }
  }, {
    key: 'setLastName',
    value: function setLastName(lastName) {
      this.lastName = lastName;
      return this.update({ lastName: lastName });
    }
  }, {
    key: 'setEmail',
    value: function setEmail(email) {
      this.email = email;
      return this.update({ email: email });
    }
  }, {
    key: 'setSetup',
    value: function setSetup() {
      this.setup = true;
      return this.update({ setup: this.setup });
    }
  }, {
    key: 'saveUTU',
    value: function saveUTU() {
      _utu.utu.user({
        platform: 'messenger',
        platformId: this.platformId,
        values: {
          firstName: this.firstName,
          lastName: this.lastName,
          balance: this.balance,
          email: this.email
        }
      }).catch(function (e) {
        return console.log(e);
      });
    }
  }, {
    key: 'isSetup',
    value: function isSetup() {
      return this.setup;
    }
  }]);
  return User;
}();

exports.default = User;