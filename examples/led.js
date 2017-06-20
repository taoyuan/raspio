"use strict";

const Led = require('..').Led;
const c = require('./constants');

const delay = ms => new Promise(resolve => setTimeout(() => resolve(), ms));

const led = new Led([c.PIN_RED, c.PIN_GREEN, c.PIN_BLUE], {invert: true, pwm: true});
led.brightness(100);
(async () => {
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






