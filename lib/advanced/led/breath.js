"use strict";

module.exports = function (total) {

  var direction = 1;

  return function (step) {
    if (step <= 0) {
      direction = 1
    } else if (step >= total - 1) {
      direction = -1;
    }

    return step + direction;
  }
};
