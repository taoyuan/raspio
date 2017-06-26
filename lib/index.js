/**
 * Created by taoyuan on 2017/6/20.
 */

exports.wpi = require('./wpi');
const GPIO = exports.GPIO = require('./gpio');
exports.Led = require('./led');
exports.Button = require('./button');
exports.Digital = require('./digital');

exports.setup = function() {
  return GPIO.setup(...arguments);
};
