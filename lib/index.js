const pinout = require('./pinout');

exports.GPIO = require('./gpio');
exports.PWM = require('./pwm');
exports.Led = require('./led');
exports.Button = require('./button');
exports.Digital = require('./digital');

exports.setup = mode => pinout.setup(mode);
