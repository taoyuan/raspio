/**
 * Created by taoyuan on 2017/6/20.
 */

exports.bcm = {
  PIN_BTN: 5,
  PIN_RED: 27, // 2
  PIN_GREEN: 17, // 0
  PIN_BLUE: 18, // 1
  PIN_DIGITAL_1: 25, //6,
  PIN_DIGITAL_2: 24, //5,
  PIN_DIGITAL_4: 23, //4,
  PIN_DIGITAL_8: 4, //7,
};

exports.wpi = {
  PIN_BTN: 21,
  PIN_RED: 2,
  PIN_GREEN: 0,
  PIN_BLUE: 1,
  PIN_DIGITAL_1: 6,
  PIN_DIGITAL_2: 5,
  PIN_DIGITAL_4: 4,
  PIN_DIGITAL_8: 7,
};

exports.physical = {
  PIN_BTN: 29,
  PIN_RED: 13,
  PIN_GREEN: 11,
  PIN_BLUE: 12,
  PIN_DIGITAL_1: 22,
  PIN_DIGITAL_2: 18,
  PIN_DIGITAL_4: 16,
  PIN_DIGITAL_8: 7,
};

function setup(mode) {
  require('..').setup(mode);
  exports.pins = exports[mode];
}

exports.setup = setup;

const mode = process.argv[2] || 'wpi';
console.log('Using pinout: ' + mode);
setup(mode);
