"use strict";

module.exports = function (total) {
  return function (step) {
    return step <= 0 ? total : --step;
  }
};
