const Gpio = require('pigpio').Gpio;
const pinout = require('./pinout');

class GPIO extends Gpio {

  static setup(mode) {
    if (!pinout[mode]) {
      throw new Error('Unsupported GPIO mode: ' + mode);
    }
    GPIO.pinmap = pinout[mode];
  }

  constructor(gpio, options) {
    super(GPIO.pinmap(gpio), options);

    options = options || {};

    if (typeof options.pwm === 'boolean' && options.pwm) {
      this._writeMode = 'pwm';
    }
  }

  write(value) {
    if (this._writeMode === 'pwm') {
      this.pwmWrite(value);
    } else {
      this.digitalWrite(value > 0 ? 1 : 0);
    }
  }
}

GPIO.setup('bcm');

module.exports = GPIO;

/* mode */
GPIO.INPUT = Gpio.INPUT; // PI_INPUT
GPIO.OUTPUT = Gpio.OUTPUT; //PI_OUTPUT;
GPIO.ALT0 = Gpio.ALT0; // PI_ALT0;
GPIO.ALT1 = Gpio.ALT1; // PI_ALT1;
GPIO.ALT2 = Gpio.ALT2; // PI_ALT2;
GPIO.ALT3 = Gpio.ALT3; // PI_ALT3;
GPIO.ALT4 = Gpio.ALT4; // PI_ALT4;
GPIO.ALT5 = Gpio.ALT5; // PI_ALT5;

/* pud */
GPIO.PUD_OFF = Gpio.PUD_OFF; // PI_PUD_OFF;
GPIO.PUD_DOWN = Gpio.PUD_DOWN; // PI_PUD_DOWN;
GPIO.PUD_UP = Gpio.PUD_UP; // PI_PUD_UP;

/* isr */
GPIO.RISING_EDGE = Gpio.RISING_EDGE; // RISING_EDGE;
GPIO.FALLING_EDGE = Gpio.FALLING_EDGE; // FALLING_EDGE;
GPIO.EITHER_EDGE = Gpio.EITHER_EDGE; // EITHER_EDGE;

/* timeout */
GPIO.TIMEOUT = Gpio.TIMEOUT; // PI_TIMEOUT;

/* gpio numbers */
GPIO.MIN_GPIO = Gpio.MIN_GPIO; // PI_MIN_GPIO;
GPIO.MAX_GPIO = Gpio.MAX_GPIO; // PI_MAX_GPIO;
GPIO.MAX_USER_GPIO = Gpio.MAX_USER_GPIO; // PI_MAX_USER_GPIO;
