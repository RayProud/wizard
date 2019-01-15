"use strict";

var _lib = _interopRequireDefault(require("../../lib"));

var _questions = _interopRequireDefault(require("./questions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const wizard = new _lib.default(_questions.default);
wizard.init().then(selections => {
  console.log(selections);
  process.exit();
});