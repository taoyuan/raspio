const EventEmitter = require('events').EventEmitter;
const pinout = require('./pinout');
const wpi = require('./wpi');

class GPIO extends EventEmitter {

  static setup(mode) {
    wpi.setup(mode);
  }

  constructor(pin, options) {
    super();

    this.pin = pin;
    options = options || {};

    if (typeof options.pwm === 'boolean' && options.pwm) {
      this._writeMode = 'pwm';
    }

    if (typeof options.mode === 'number') {
      this.mode(options.mode);
    }

    if (typeof options.pullUpDown === 'number') {
      this.pullUpDown(options.pullUpDown);
    }

    if (typeof options.edge === 'number') {
      this.enableInterrupt(options.edge);
    }
  }

  mode(value) {
    if (value !== wpi.INPUT && value !== wpi.OUTPUT) {
      throw new Error('Invalid GPIO mode "' + value + '". Mode must be either raspi.GPIO.INPUT or raspi.GPIO.OUTPUT');
    }
    wpi.pinMode(this.pin, value);
  }

  pullUpDown(value) {
    if (typeof value !== 'undefined' && ![
        GPIO.PUD_OFF,
        GPIO.PUD_DOWN,
        GPIO.PUD_UP
      ].includes(value)) {
      throw new Error('Invalid GPIO pull up/down setting "' + value +
        '". Pull Up/Down must be a constant specified in raspi.constants');
    }
    wpi.pullUpDnControl(this.pin, value);
  }

  enableInterrupt(edge) {
    if (this._interrupt) return;

    if (edge === undefined || edge === null) {
      edge = wpi.EDGE_BOTH;
    }

    this._interrupt = true;
    wpi.wiringPiISR(this.pin, edge, () => this.emit('interrupt', this.read()));
  }

  disableInterrupt() {
    if (this._interrupt) {
      wpi.wiringPiISRCancel(this.pin);
    }
    this._interrupt = false;
  }

  digitalRead() {
    return wpi.digitalRead(this.pin);
  }

  digitalWrite(value) {
    if (value !== wpi.LOW && value !== wpi.HIGH) {
      throw new Error('Invalid write value "' + value + '". Value must be raspi.constants.LOW or raspi.constants.HIGH');
    }
    wpi.digitalWrite(this.pin, value);
  }

  analogRead() {
    return wpi.analogRead(this.pin);
  }

  analogWrite(value) {
    return wpi.analogWrite(this.pin, value);
  }

  read() {
    return this.digitalRead();
  }

  write(value) {
    if (this._writeMode === 'pwm') {
      return this.pwmWrite(value);
    } else {
      return this.digitalWrite(value ? GPIO.HIGH : GPIO.LOW);
    }
  }

  pwmRange(range) {
    return this.pwmSetRange(this.pin, range);
  }

  pwmFrequency(frequency) {
    return wpi.gpioClockSet(this.pin, frequency);
  }

  pwmWrite(value) {
    return wpi.pwmWrite(this.pin, value);
  }
}

module.exports = GPIO;

/* levels */
GPIO.OFF = wpi.LOW;
GPIO.LOW = wpi.LOW;
GPIO.CLEAR = wpi.LOW;

GPIO.ON = wpi.HIGH;
GPIO.HIGH = wpi.HIGH;
GPIO.SET = wpi.HIGH;

/* mode */
GPIO.INPUT = wpi.FSEL_INPT; // PI_INPUT
GPIO.OUTPUT = wpi.FSEL_OUTP; //PI_OUTPUT;
GPIO.ALT0 = wpi.FSEL_ALT0; // PI_ALT0;
GPIO.ALT1 = wpi.FSEL_ALT1; // PI_ALT1;
GPIO.ALT2 = wpi.FSEL_ALT2; // PI_ALT2;
GPIO.ALT3 = wpi.FSEL_ALT3; // PI_ALT3;
GPIO.ALT4 = wpi.FSEL_ALT4; // PI_ALT4;
GPIO.ALT5 = wpi.FSEL_ALT5; // PI_ALT5;

/* pud */
GPIO.PUD_OFF = wpi.PUD_OFF; // PI_PUD_OFF;
GPIO.PUD_DOWN = wpi.PUD_DOWN; // PI_PUD_DOWN;
GPIO.PUD_UP = wpi.PUD_UP; // PI_PUD_UP;

/* isr */
GPIO.EDGE_FALLING = wpi.EDGE_FALLING;
GPIO.EDGE_RISING = wpi.EDGE_RISING;
GPIO.EDGE_BOTH = wpi.EDGE_BOTH;
GPIO.EDGE_SETUP = wpi.EDGE_SETUP;

GPIO.PWM_MODE_BAL = wpi.PWM_MODE_BAL;
GPIO.PWM_MODE_MS = wpi.PWM_MODE_MS;

GPIO.setup('wpi');
