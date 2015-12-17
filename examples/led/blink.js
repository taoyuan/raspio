"use strict";

var LED = require('../../').LED;

var led = new LED([0, 1, 2]);
led.blink(0xFFFFFF);
