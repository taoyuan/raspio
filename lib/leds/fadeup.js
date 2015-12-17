"use strict";

module.exports = function (total) {

  return function (step) {
    return step >= total - 1 ? 0 : ++step;
  }
};
