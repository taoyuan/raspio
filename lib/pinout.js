const rev = require('./revision');

/*
 * Valid GPIO pins, using GPIOxx BCM numbering.
 */
const BCM = {
  'v1rev1': [
    0, 1, 4, 7, 8, 9, 10, 11, 14, 15, 17, 18, 21, 22, 23, 24, 25
  ],
  'v1rev2': [
    2, 3, 4, 7, 8, 9, 10, 11, 14, 15, 17, 18, 22, 23, 24, 25, 27,
    28, 29, 30, 31
  ],
  'v2plus': [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24, 25, 26, 27
  ]
};

/*
 * Map physical pin to BCM GPIOxx numbering.
 */

const PHYSICAL = {
  'v1rev1': {
    3: 0,
    5: 1,
    7: 4,
    8: 14,
    10: 15,
    11: 17,
    12: 18,
    13: 21,
    15: 22,
    16: 23,
    18: 24,
    19: 10,
    21: 9,
    22: 25,
    23: 11,
    24: 8,
    26: 7
  },
  'v1rev2': {
    3: 2,
    5: 3,
    7: 4,
    8: 14,
    10: 15,
    11: 17,
    12: 18,
    13: 27,
    15: 22,
    16: 23,
    18: 24,
    19: 10,
    21: 9,
    22: 25,
    23: 11,
    24: 8,
    26: 7
    /* XXX: no support for the P5 header pins. */
  },
  'v2plus': {
    3: 2,
    5: 3,
    7: 4,
    8: 14,
    10: 15,
    11: 17,
    12: 18,
    13: 27,
    15: 22,
    16: 23,
    18: 24,
    19: 10,
    21: 9,
    22: 25,
    23: 11,
    24: 8,
    26: 7,
    29: 5,
    31: 6,
    32: 12,
    33: 13,
    35: 19,
    36: 16,
    37: 26,
    38: 20,
    40: 21
  },
};

const WPI = {
  v1rev1: {
    0: 17,
    1: 18,
    2: 21,
    3: 22,
    4: 23,
    5: 24,
    6: 25,
    7: 4,
    8: 0,
    9: 1,
    10: 8,
    11: 7,
    12: 10,
    13: 9,
    14: 11,
    15: 14,
    16: 15
  },
  v1rev2: {
    0: 17,
    1: 18,
    2: 27,
    3: 22,
    4: 23,
    5: 24,
    6: 25,
    7: 4,
    8: 2,
    9: 3,
    10: 8,
    11: 7,
    12: 10,
    13: 9,
    14: 11,
    15: 14,
    16: 15,
    17: 28,
    18: 29,
    19: 30,
    20: 31
  },
  v2plus: {
    0: 17,
    1: 18,
    2: 27,
    3: 22,
    4: 23,
    5: 24,
    6: 25,
    7: 4,
    8: 2,
    9: 3,
    10: 8,
    11: 7,
    12: 10,
    13: 9,
    14: 11,
    15: 14,
    16: 15,
    21: 5,
    22: 6,
    23: 13,
    24: 19,
    25: 26,
    26: 12,
    27: 16,
    28: 20,
    29: 21,
    30: 0,
    31: 1,
  },
};

const mappers = {};
mappers.bcm = pin => {
  const mapping = BCM[rev];
  if (mapping.indexOf(pin) === -1) {
    throw new Error("Invalid pin: " + pin);
  }
  return pin;
};
mappers.gpio = mappers.bcm;

mappers.wpi = pin => {
  const mapping = WPI[rev];
  if (!(pin in mapping)) {
    throw new Error("Invalid pin: " + pin);
  }
  return mapping[pin];
};

mappers.physical = pin => {
  const mapping = PHYSICAL[rev];
  if (!(pin in mapping)) {
    throw new Error("Invalid pin: " + pin);
  }
  return mapping[pin];
};

/**
 * Default bcm mapper
 * @type {Function}
 */
let mapper = mappers.bcm;

exports.setup = mode => {
  if (!mappers[mode]) {
    throw new Error('Unsupported GPIO mapping: ' + mode);
  }
  mapper = mappers[mode];
};

exports.map = pin => mapper(pin);

