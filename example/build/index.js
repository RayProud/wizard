"use strict";

var _lib = _interopRequireDefault(require("../../lib"));

var _questions = _interopRequireDefault(require("./questions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wizard = new _lib.default(_questions.default);
wizard.init().then(function (selections) {
  // Selections represents all the choices made by the user
  // selections: (e.g)
  // -> configType = 'template'
  // -> template = 'react-app'
  console.log(selections);
});