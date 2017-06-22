"use strict";

const Led = require('..').Led;
const pins = require('./pins').pins;

const delay = ms => new Promise(resolve => setTimeout(() => resolve(), ms));

const led = new Led([pins.PIN_RED, pins.PIN_GREEN, pins.PIN_BLUE], {invert: true, pwm: true, uri: 'raspberrypi.local'});

(async () => {
  await led.brightness(100);

  led.light(Led.red);
  await delay(2000);

  led.light(Led.green);
  await delay(2000);

  led.light(Led.blue);
  await delay(2000);

  led.blink(Led.cyan, 500);
  await delay(5000);

  led.fadeup(Led.white, 10);
  await delay(5000);

  led.fadedown(Led.white, 10);
  await delay(5000);

  led.breath(Led.green, 10);
  await delay(5000);

  led.light(Led.black);
  await delay(5000);
})();






