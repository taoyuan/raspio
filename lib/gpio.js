const EventEmitter = require('events').EventEmitter;
const PromiseA = require('bluebird');
const pinout = require('./pinout');
const pigpio = require('./pigpio');

class GPIO extends EventEmitter {

  static setup(mode) {
    if (!pinout[mode]) {
      throw new Error('Unsupported GPIO mode: ' + mode);
    }
    GPIO.pinmap = pinout[mode];
  }

  constructor(pin, options) {
    super();

    this._gpio = GPIO.pinmap(pin);
    options = options || {};

    if (typeof options.pwm === 'boolean' && options.pwm) {
      this._writeMode = 'pwm';
    }

    const host = options.host || options.uri;
    const port = options.port;

    this._pigpio = pigpio.connect(host, port);
    this.$connected = this._pigpio.$ready;
    this.$ready = this._init(options);
  }

  async _init(options) {
    await this.$connected;
    options = options || {};
    if (typeof options.mode === 'number') {
      await this.mode(options.mode);
    }

    if (typeof options.pullUpDown === 'number') {
      await this.pullUpDown(options.pullUpDown);
    }

    if (typeof options.edge === 'number') {
      await this.enableInterrupt(options.edge);
    }
  }

  ready(cb) {
    return this.$ready.then(() => cb && cb());
  }

  async getMode() {
    await this.$connected;
    return await PromiseA.fromCallback(cb => this._pigpio.get_mode(this._gpio, cb));
  }

  /**
   * Sets the GPIO mode.
   *
   * @param {Number} mode - Must be either INPUT, OUTPUT, ALT0, ALT1, ALT2, ALT3, ALT4 or ALT5.
   */
  async mode(mode) {
    await this.$connected;
    this._pigpio.set_mode(this._gpio, mode);
  }

  /**
   * Sets or clears the internal GPIO pull-up/down resistor.
   *
   * @param {Number} pud - Must be either PUD_UP, PUD_DOWN, PUD_OFF.
   */
  async pullUpDown(pud) {
    await this.$connected;
    this._pigpio.set_pull_up_down(this._gpio, pud);
  }


  async enableInterrupt(edge) {
    await this.$connected;
    return this._listener = this._pigpio.callback(this._gpio, edge, (gpio, level, tick) => {
      this.emit('interrupt', level, tick);
    });
  }

  async disableInterrupt() {
    await this.$connected;
    this._listener.cancel();
    this._listener = null;
  }

  /**
   *
   * Starts (500-2500) or stops (0) servo pulses on the given gpio pin.
   *
   * The selected pulse width will continue to be transmitted until
   * changed by a subsequent call to servoWrite.
   *
   * The pulsewidths supported by servos varies and should probably
   * be determined by experiment. A value of 1500 should always be
   * safe and represents the mid-point of rotation.
   *
   * You can DAMAGE a servo if you command it to move beyond its
   * limits.
   *
   * @example
   *     gpio.servoWrite(0)    # off
   *     gpio.servoWrite(1000) # safe anti-clockwise
   *     gpio.servoWrite(1500) # centre
   *     gpio.servoWrite(2000) # safe clockwise
   *
   * @param {number} pulseWidth - The servo pulse width to generate
   *              0 (off),
   *              500 (most anti-clockwise) - 2500 (most clockwise).
   */
  async servoWrite(pulseWidth) {
    await this.$ready;
    this._pigpio.setServoPulsewidth(this._gpio, pulseWidth);
  }

  async digitalRead() {
    await this.$ready;
    return await PromiseA.fromCallback(cb => this._pigpio.read(this._gpio, cb));
  }

  async digitalWrite(level) {
    await this.$ready;
    return await PromiseA.fromCallback(cb => this._pigpio.write(this._gpio, level, cb));
  }

  async getPwmRange() {
    await this.$connected;
    return await PromiseA.fromCallback(cb => this._pigpio.get_PWM_range(this._gpio, cb));
  }


  /**
   * Sets the range of PWM values to be used on the GPIO.
   *
   * @param {number} range - A number in the range 25-40000.
   *
   * @example
   *  gpio.pwmRange(100)  // now  25 1/4,   50 1/2,   75 3/4 on
   *  gpio.pwmRange(500)  // now 125 1/4,  250 1/2,  375 3/4 on
   *  gpio.pwmRange(3000) // now 750 1/4, 1500 1/2, 2250 3/4 on
   */
  async pwmRange(range) {
    await this.$ready;
    return await this._pigpio.set_PWM_range(this._gpio, range);
  }

  async getPwmDutyCycle() {
    await this.$connected;
    return await PromiseA.fromCallback(cb => this._pigpio.get_PWM_dutycycle(this._gpio, cb));
  }

  /**
   * Returns the real (underlying) range of PWM values being used on the GPIO.
   *
   * If a hardware clock is active on the GPIO the reported real range will be 1000000 (1M).
   * If hardware PWM is active on the GPIO the reported real range
   * will be approximately 250M divided by the set PWM frequency.
   *
   */
  async getPwmRealRange() {
    await this.$connected;
    return await PromiseA.fromCallback(cb => this._pigpio.get_PWM_real_range(this._gpio, cb));
  }

  async getPwmFrequency() {
    await this.$connected;
    return await PromiseA.fromCallback(cb => this._pigpio.get_PWM_frequency(this._gpio, cb));
  }


  /**
   * Sets the frequency (in Hz) of the PWM to be used on the GPIO.
   *
   * If PWM is currently active on the GPIO it will be switched
   * off and then back on at the new frequency.
   * Each GPIO can be independently set to one of 18 different PWM frequencies.
   * The selectable frequencies depend upon the sample rate which
   * may be 1, 2, 4, 5, 8, or 10 microseconds (default 5).
   * The sample rate is set when the pigpio daemon is started.
   *
   * The frequencies for each sample rate are:
   * hertz
   *      1:   40000 20000 10000 8000 5000 4000 2500 2000 1600
   *            1250  1000   800  500  400  250  200  100   50
   *      2:   20000 10000  5000 4000 2500 2000 1250 1000  800
   *             625   500   400  250  200  125  100   50   25
   *      4:   10000  5000  2500 2000 1250 1000  625  500  400
   *             313   250   200  125  100   63   50   25   13
   * sample
   * rate
   * (us)  5:  8000  4000  2000 1600 1000  800  500  400  320
   *            250   200   160  100   80   50   40   20   10
   *       8:  5000  2500  1250 1000  625  500  313  250  200
   *            156   125   100   63   50   31   25   13    6
   *      10:  4000  2000  1000  800  500  400  250  200  160
   *            125   100    80   50   40   25   20   10    5.
   *
   * @param {number} frequency - Frequency >=0 Hz.
   */
  async pwmFrequency(frequency) {
    await this.$ready;
    return await this._pigpio.set_PWM_frequency(this._gpio, frequency);
  }

  async pwmWrite(dutyCycle) {
    await this.$ready;
    return await this._pigpio.set_PWM_dutycycle(this._gpio, dutyCycle);
  }

  async write(value) {
    await this.$ready;
    if (this._writeMode === 'pwm') {
      return await this.pwmWrite(value);
    } else {
      return await this.digitalWrite(value ? GPIO.HIGH : GPIO.LOW);
    }
  }
}

GPIO.setup('bcm');

module.exports = GPIO;

/* levels */
GPIO.OFF = 0;
GPIO.LOW = 0;
GPIO.CLEAR = 0;

GPIO.ON = 1;
GPIO.HIGH = 1;
GPIO.SET = 1;

/* mode */
GPIO.INPUT = 0; // PI_INPUT
GPIO.OUTPUT = 1; //PI_OUTPUT;
GPIO.ALT0 = 4; // PI_ALT0;
GPIO.ALT1 = 5; // PI_ALT1;
GPIO.ALT2 = 6; // PI_ALT2;
GPIO.ALT3 = 7; // PI_ALT3;
GPIO.ALT4 = 3; // PI_ALT4;
GPIO.ALT5 = 2; // PI_ALT5;

/* pud */
GPIO.PUD_OFF = 0; // PI_PUD_OFF;
GPIO.PUD_DOWN = 1; // PI_PUD_DOWN;
GPIO.PUD_UP = 2; // PI_PUD_UP;

/* isr */
GPIO.RISING_EDGE = 0; // RISING_EDGE;
GPIO.FALLING_EDGE = 1; // FALLING_EDGE;
GPIO.EITHER_EDGE = 2; // EITHER_EDGE;

/* timeout */
GPIO.TIMEOUT = 2; // PI_TIMEOUT;

/* gpio numbers */
GPIO.MIN_GPIO = 0; // PI_MIN_GPIO;
GPIO.MAX_GPIO = 53; // PI_MAX_GPIO;
GPIO.MAX_USER_GPIO = 31; // PI_MAX_USER_GPIO;
