"use strict";

var _wpi = require('wiring-pi');

var wpi = module.exports = exports = {};

/**
 * An handy function to setup wiringPi
 *
 * @param mode can be one of the following values:
 *  wpi: sets up pin numbering with wiringPiSetup  >= 0.1.1
 *  gpio: sets up pin numbering with wiringPiSetupGpio  >= 0.1.1
 *  sys: sets up pin numbering with wiringPiSetupSys  >= 0.1.1
 *  phys: sets up pin numbering with wiringPiSetupPhys  >= 1.0.0
 *
 *  More info about pin numbering systems at wiringpi.com/pins/
 *
 */
wpi.setup = function setup(mode) {
  return _wpi.setup(mode);
};


/**
 * This is an un-documented special to let you set any pin to any mode.
 * @param pin
 * @param mode
 *  mode can be one of the following values:
 *  FSEL_INPT  >= 2.1.0
 *  FSEL_OUTP  >= 2.1.0
 *  FSEL_ALT0  >= 2.1.0
 *  FSEL_ALT1  >= 2.1.0
 *  FSEL_ALT2  >= 2.1.0
 *  FSEL_ALT3  >= 2.1.0
 *  FSEL_ALT4  >= 2.1.0
 *  FSEL_ALT5  >= 2.1.0
 */
wpi.pinModeAlt = function pinModeAlt(pin, mode) {
  return _wpi.pinModeAlt(pin, mode);
};


/**
 * This sets the mode of a pin.
 * Note that only wiringPi pin 1 (BCM_GPIO 18) supports PWM output and only wiringPi pin 7 (BCM_GPIO 4) supports CLOCK output modes.
 * This function has no effect when in Sys mode.
 * If you need to change the pin mode, the you can do it with the gpio program in a script before you start your program.
 * @param pin
 * @param mode
 *  mode can be one of the following values:
 *  modes.INPUT  >= 0.1.1 < 2.0.0 removed
 *  modes.OUTPUT  >= 0.1.1 < 2.0.0 removed
 *  modes.PWM_OUTPUT  >= 0.1.1 < 2.0.0 removed
 *  modes.GPIO_CLOCK  >= 0.1.1 < 2.0.0 removed
 *  INPUT  >= 1.0.0
 *  OUTPUT  >= 1.0.0
 *  PWM_OUTPUT  >= 1.0.0
 *  GPIO_CLOCK  >= 1.0.0
 *  SOFT_PWM_OUTPUT  >= 1.1.0
 *  SOFT_TONE_OUTPUT  >= 1.1.0
 */
wpi.pinMode = function pinMode(pin, mode) {
  return _wpi.pinMode(pin, mode);
};


/**
 * This sets the pull-up or pull-down resistor mode on the given pin, which should be set as an input.
 * Unlike Arduino, the BCM2835 has both pull-up and down internal resistors.
 * The internal pull up/down resistors have a value of approximately 50KΩ on the Raspberry Pi.
 * @param  pin
 * @param  pud
 *  pud can be one of the following values:
 *  PUD_OFF no pull up/down  >= 0.2.0
 *  PUD_DOWN pull to ground  >= 0.2.0
 *  PUD_UP pull to 3.3v  >= 0.2.0
 */
wpi.pullUpDnControl = function pullUpDnControl(pin, pud) {
  return _wpi.pullUpDnControl(pin, pud);
};


/**
 * This function returns the value read at the given pin.
 * It will be HIGH (1) or LOW (0) depending on the logic level at the pin.
 * @param  pin
 */
wpi.digitalRead = function digitalRead(pin) {
  return _wpi.digitalRead(pin);
};


/**
 * Write the value HIGH (1) or LOW (0) to the given pin which must have been previously set as an output.
 * WiringPi treats any non-zero number as HIGH, however 0 is the only representation of LOW.
 * @param  pin
 * @param  state
 *  state can be one of the following value:
 *  HIGH  >= 0.1.2
 *  LOW  >= 0.1.2
 */
wpi.digitalWrite = function digitalWrite(pin, state) {
  return _wpi.digitalWrite(pin, state);
};


/**
 * Writes the value to the PWM register for the given pin.
 * The Raspberry Pi has one on-board PWM pin, pin 1 (BCM_GPIO 18, Phys 12) and the range is [0, 1024].
 * Other PWM devices may have other PWM ranges.
 * This function is not able to control the Pi's on-board PWM when in Sys mode.
 * @param  pin
 * @param  value
 */
wpi.pwmWrite = function pwmWrite(pin, value) {
  return _wpi.pwmWrite(pin, value);
};


/**
 * This returns the value read on the supplied analog input pin.
 * You will need to register additional analog modules to enable this function for device such as the Gertboard, quick2Wire analog board, etc.
 * @param  pin
 */
wpi.analogRead = function analogRead(pin) {
  return _wpi.analogRead(pin);
};


/**
 * This writes the given value to the supplied analog pin.
 * You will need to register additional analog modules to enable this function for devices such as the Gertboard.
 * @param  pin
 * @param  value
 */
wpi.analogWrite = function analogWrite(pin, value) {
  return _wpi.analogWrite(pin, value);
};


/**
 * Reads a pulse (either HIGH or LOW) on a pin.
 * For example, if state is HIGH, pulseIn waits for the pin to go HIGH, starts timing, then waits for the pin to go LOW and stops timing.
 * Returns the length of the pulse in microseconds.
 * Gives up and returns 0 if no pulse starts within a specified time out.
 * @param  pin
 * @param  state
 *  state can be one of the following values:
 *  HIGH  >= 0.1.2
 *  LOW  >= 0.1.2
 */
wpi.pulseIn = function pulseIn(pin, state) {
  return _wpi.pulseIn(pin, state);
};


/**
 * Pauses the program for the amount of time (in miliseconds) specified as parameter.
 * There are 1000 milliseconds in a second.
 * @param  milliseconds
 */
wpi.delay = function delay(milliseconds) {
  return _wpi.delay(milliseconds);
};


/**
 * Pauses the program for the amount of time (in microseconds) specified as parameter.
 * There are a thousand microseconds in a millisecond, and a million microseconds in a second.
 * For delays longer than a few thousand microseconds, you should use delay() instead.
 * @param  microseconds
 */
wpi.delayMicroseconds = function delayMicroseconds(microseconds) {
  return _wpi.delayMicroseconds(microseconds);
};


/**
 * Returns the number of milliseconds since the beginning running of the current program
 */
wpi.millis = function millis() {
  return _wpi.millis();
};


/**
 * Returns the number of microseconds since the beginning running of the current program
 */
wpi.micros = function micros() {
  return _wpi.micros();
};


/**
 * This function registers a function to received interrupts on the specified pin.
 * The edgeType parameter is either INT_EDGE_FALLING, INT_EDGE_RISING, INT_EDGE_BOTH or INT_EDGE_SETUP.
 * If it is INT_EDGE_SETUP then no initialisation of the pin will happen – it’s assumed that you have already setup the pin elsewhere (e.g. with the gpio program), but if you specify one of the other types, then the pin will be exported and initialised as specified.
 * This is accomplished via a suitable call to the gpio utility program, so it need to be available.
 * The pin number is supplied in the current mode – native wiringPi, BCM_GPIO, physical or Sys modes.
 * This function will work in any mode, and does not need root privileges to work.
 * The callback will be called when the interrupt triggers.
 * When it is triggered, it’s cleared in the dispatcher before calling your function, so if a subsequent interrupt fires before you finish your handler, then it won’t be missed.
 * However it can only track one more interrupt, if more than one interrupt fires while one is being handled then they will be ignored.
 * @param  pin
 * @param  edgeType
 * @param  callback
 */
wpi.wiringPiISR = function wiringPiISR(pin, edgeType, callback) {
  return _wpi.wiringPiISR(pin, edgeType, callback);
};


/**
 * @param  pin
 */
wpi.wiringPiISRCancel = function wiringPiISRCancel(pin) {
  return _wpi.wiringPiISRCancel(pin);
};


/**
 * This returns the board revision of the Raspberry Pi.
 * It will be either 1 or 2.
 * Some of the BCM_GPIO pins changed number and function when moving from board revision 1 to 2, so if you are using BCM_GPIO pin numbers, then you need to be aware of the differences.
 */
wpi.piBoardRev = function piBoardRev() {
  return _wpi.piBoardRev();
};


/**
 * Do more digging into the board revision string as above, but return as much details as we can.
 * Returns an object with the following keys:
 *   model: indexes to PI_MODEL_NAMES string table
 *   rev: indexes to PI_REVISION_NAMES string table
 *   mem: 256 or 512
 *   maker: indexes to PI_MAKER_NAMES string table
 *   overvolted: 0 or 1  >= 2.0.0
 *
 *  NOTE: maker was a string in versions >= 1.1.0 and < 2.0.0
 *
 *  Indexes of each string table have corresponding constants
 *   PI_MODEL_NAME
 *    PI_MODEL_UNKNOWN  >= 2.0.0
 *    PI_MODEL_A  >= 1.1.0
 *    PI_MODEL_AP  >= 2.1.0
 *    PI_MODEL_B  >= 1.1.0
 *    PI_MODEL_BP  >= 2.0.0
 *    PI_MODEL_CM  >= 1.1.1
 *    PI_MODEL_2  >= 2.1.0
 *
 *   PI_REVISION_NAMES
 *    PI_VERSION_UNKNOWN  >= 2.0.0
 *    PI_VERSION_1  >= 2.0.0
 *    PI_VERSION_1_1  >= 2.0.0
 *    PI_VERSION_1_2  >= 2.0.0
 *    PI_VERSION_2  >= 2.0.0
 *
 *   PI_MAKER_NAMES
 *    PI_MAKER_UNKNOWN  >= 2.0.0
 *    PI_MAKER_EGOMAN  >= 2.0.0
 *    PI_MAKER_MBEST  >= 2.1.0
 *    PI_MAKER_SONY  >= 2.0.0
 *    PI_MAKER_QISDA  >= 2.0.0
 */
wpi.piBoardId = function piBoardId() {
  return _wpi.piBoardId();
};


/**
 * This returns the BCM_GPIO pin number of the supplied wiringPi pin.
 * It takes the board revision into account.
 * @param  pin
 */
wpi.wpiPinToGpio = function wpiPinToGpio(pin) {
  return _wpi.wpiPinToGpio(pin);
};


/**
 * This returns the BCM_GPIO pin number of the suppled physical pin on the P1 connector.
 * @param  pin
 */
wpi.physPinToGpio = function physPinToGpio(pin) {
  return _wpi.physPinToGpio(pin);
};


/**
 * This sets the "strength" of the pad drivers for a particular group of pins.
 * There are 3 groups of pins and the drive strength is from 0 to 7.
 *
 * NOTE: Do not use the unless you know what you are doing.
 * @param  group
 * @param  value
 */
wpi.setPadDrive = function setPadDrive(group, value) {
  return _wpi.setPadDrive(group, value);
};


/**
 * Returns the ALT bits for a given port.
 * @param  pin
 */
wpi.getAlt = function getAlt(pin) {
  return _wpi.getAlt(pin);
};


/**
 * This writes the 8-bit byte supplied to the first 8 GPIO pins.
 * It’s the fastest way to set all 8 bits at once to a particular value, although it still takes two write operations to the Pi’s GPIO hardware.
 * @param  byte
 */
wpi.digitalWriteByte = function digitalWriteByte(byte) {
  return _wpi.digitalWriteByte(byte);
};


/**
 * The PWM generator can run in 2 modes – “balanced” and “mark:space”.
 * The mark:space mode is traditional, however the default mode in the Pi is “balanced”.
 * @param  mode
 *  mode can be one of the following values:
 *  PWM_MODE_BAL balanced
 *  PWM_MODE_MS mark:space
 */
wpi.pwmSetMode = function pwmSetMode(mode) {
  return _wpi.pwmSetMode(mode);
};


/**
 * This sets the range register in the PWM generator.
 * The default is 1024.
 *
 * NOTE: The PWM control functions can not be used when in Sys mode. To understand more about the PWM system, you’ll need to read the Broadcom ARM peripherals manual.
 * @param  range
 */
wpi.pwmSetRange = function pwmSetRange(range) {
  return _wpi.pwmSetRange(range);
};


/**
 * This sets the divisor for the PWM clock.
 *
 * NOTE: The PWM control functions can not be used when in Sys mode. To understand more about the PWM system, you’ll need to read the Broadcom ARM peripherals manual.
 * @param  divisor
 */
wpi.pwmSetClock = function pwmSetClock(divisor) {
  return _wpi.pwmSetClock(divisor);
};


/**
 * Output the given frequency on the Pi's PWM pin
 * @param  pin
 * @param  frequency
 */
wpi.pwmToneWrite = function pwmToneWrite(pin, frequency) {
  return _wpi.pwmToneWrite(pin, frequency);
};


/**
 * Set the frequency on a GPIO clock pin
 * @param  pin
 * @param  frequency
 */
wpi.gpioClockSet = function gpioClockSet(pin, frequency) {
  return _wpi.gpioClockSet(pin, frequency);
};


/**
 * This initialises the I2C system with your given device identifier.
 * The ID is the I2C number of the device and you can use the i2cdetect program to find this out.
 * wiringPiI2CSetup() will work out which revision Raspberry Pi you have and open the appropriate device in /dev.
 * The return value is the standard Linux filehandle, or -1 if any error – in which case, you can consult errno as usual.
 * @param  devId
 */
wpi.wiringPiI2CSetup = function wiringPiI2CSetup(devId) {
  return _wpi.wiringPiI2CSetup(devId);
};


/**
 * Undocumented access to set the interface explicitly - might be used for the Pi's 2nd I2C interface...
 * @param  device
 * @param  devId
 */
wpi.wiringPiI2CSetupInterface = function wiringPiI2CSetupInterface(device, devId) {
  return _wpi.wiringPiI2CSetupInterface(device, devId);
};


/**
 * Simple device read.
 * Some devices present data when you read them without having to do any register transactions.
 * @param  fd
 */
wpi.wiringPiI2CRead = function wiringPiI2CRead(fd) {
  return _wpi.wiringPiI2CRead(fd);
};


/**
 * This read an 8-bit value from the device register indicated.
 * @param  fd
 * @param  reg
 */
wpi.wiringPiI2CReadReg8 = function wiringPiI2CReadReg8(fd, reg) {
  return _wpi.wiringPiI2CReadReg8(fd, reg);
};


/**
 * This read an 16-bit value from the device register indicated.
 * @param  fd
 * @param  reg
 */
wpi.wiringPiI2CReadReg16 = function wiringPiI2CReadReg16(fd, reg) {
  return _wpi.wiringPiI2CReadReg16(fd, reg);
};


/**
 * Simple device write.
 * Some devices accept data this way without needing to access any internal registers.
 * @param  fd
 * @param  data
 */
wpi.wiringPiI2CWrite = function wiringPiI2CWrite(fd, data) {
  return _wpi.wiringPiI2CWrite(fd, data);
};


/**
 * This write an 8-bit data value into the device register indicated.
 * @param  fd
 * @param  reg
 * @param  data
 */
wpi.wiringPiI2CWriteReg8 = function wiringPiI2CWriteReg8(fd, reg, data) {
  return _wpi.wiringPiI2CWriteReg8(fd, reg, data);
};


/**
 * This write an 16-bit data value into the device register indicated.
 * @param  fd
 * @param  reg
 * @param  data
 */
wpi.wiringPiI2CWriteReg16 = function wiringPiI2CWriteReg16(fd, reg, data) {
  return _wpi.wiringPiI2CWriteReg16(fd, reg, data);
};


/**
 * Returns the file-descriptor for the given channel
 * @param  channel
 */
wpi.wiringPiSPIGetFd = function wiringPiSPIGetFd(channel) {
  return _wpi.wiringPiSPIGetFd(channel);
};


/**
 * This performs a simultaneous write/read transaction over the selected SPI bus.
 * Data that was in your buffer is overwritten by data returned from the SPI bus.
 * It is possible to do simple read and writes over the SPI bus using the standard read() and write() system calls though – write() may be better to use for sending data to chains of shift registers, or those LED strings where you send RGB triplets of data.
 * Devices such as A/D and D/A converters usually need to perform a concurrent write/read transaction to work.
 * @param  channel
 * @param  data
 */
wpi.wiringPiSPIDataRW = function wiringPiSPIDataRW(channel, data) {
  return _wpi.wiringPiSPIDataRW(channel, data);
};


/**
 * This is the way to initialise a channel (The Pi has 2 channels; 0 and 1).
 * The speed parameter is an integer in the range 500,000 through 32,000,000 and represents the SPI clock speed in Hz.
 * The returned value is the Linux file-descriptor for the device, or -1 on error.
 * If an error has happened, you may use the standard errno global variable to see why.
 * @param  channel
 * @param  data
 */
wpi.wiringPiSPISetup = function wiringPiSPISetup(channel, data) {
  return _wpi.wiringPiSPISetup(channel, data);
};


/**
 * @param  channel
 * @param  speed
 * @param  mode
 */
wpi.wiringPiSPISetupMode = function wiringPiSPISetupMode(channel, speed, mode) {
  return _wpi.wiringPiSPISetupMode(channel, speed, mode);
};


/**
 * This opens and initialises the serial device and sets the baud rate.
 * It sets the port into “raw” mode (character at a time and no translations), and sets the read timeout to 10 seconds.
 * The return value is the file descriptor or -1 for any error, in which case errno will be set as appropriate.
 *
 * NOTE: The file descriptor (fd) returned is a standard Linux file descriptor.
 * You can use the standard read(), write(), etc. system calls on this file descriptor as required.
 * E.g. you may wish to write a larger block of binary data where the serialPutchar() or serialPuts() function may not be the most appropriate function to use, in which case, you can use write() to send the data.
 * @param  device
 * @param  baudrate
 */
wpi.serialOpen = function serialOpen(device, baudrate) {
  return _wpi.serialOpen(device, baudrate);
};


/**
 * Closes the device identified by the file descriptor given.
 * @param  fd
 */
wpi.serialClose = function serialClose(fd) {
  return _wpi.serialClose(fd);
};


/**
 * This discards all data received, or waiting to be send down the given device.
 * @param  fd
 */
wpi.serialFlush = function serialFlush(fd) {
  return _wpi.serialFlush(fd);
};


/**
 * Sends the single byte to the serial device identified by the given file descriptor.
 * @param  fd
 * @param  character
 */
wpi.serialPutchar = function serialPutchar(fd, character) {
  return _wpi.serialPutchar(fd, character);
};


/**
 * Sends the nul-terminated string to the serial device identified by the given file descriptor.
 * @param  fd
 * @param  string
 */
wpi.serialPuts = function serialPuts(fd, string) {
  return _wpi.serialPuts(fd, string);
};


/**
 * @param  fd
 * @param  string
 */
wpi.serialPrintf = function serialPrintf(fd, string) {
  return _wpi.serialPrintf(fd, string);
};


/**
 * Returns the number of characters available for reading, or -1 for any error condition, in which case errno will be set appropriately.
 * @param  fd
 */
wpi.serialDataAvail = function serialDataAvail(fd) {
  return _wpi.serialDataAvail(fd);
};


/**
 * Returns the next character available on the serial device.
 * This call will block for up to 10 seconds if no data is available (when it will return -1)
 * @param  fd
 */
wpi.serialGetchar = function serialGetchar(fd) {
  return _wpi.serialGetchar(fd);
};


/**
 * This shifts an 8-bit data value in with the data appearing on the dPin and the clock being sent out on the cPin.
 * Order is either LSBFIRST or MSBFIRST.
 * The data is sampled after the cPin goes high. (So cPin high, sample data, cPin low, repeat for 8 bits) The 8-bit value is returned by the function.
 * @param  dPin
 * @param  cPin
 * @param  order
 */
wpi.shiftIn = function shiftIn(dPin, cPin, order) {
  return _wpi.shiftIn(dPin, cPin, order);
};


/**
 * The shifts an 8-bit data value val out with the data being sent out on dPin and the clock being sent out on the cPin.
 * Order is as above.
 * Data is clocked out on the rising or falling edge – ie. dPin is set, then cPin is taken high then low – repeated for the 8 bits.
 * @param  dPin
 * @param  cPin
 * @param  order
 * @param  value
 */
wpi.shiftOut = function shiftOut(dPin, cPin, order, value) {
  return _wpi.shiftOut(dPin, cPin, order, value);
};


/**
 * This creates a software controlled PWM pin.
 * You can use any GPIO pin and the pin numbering will be that of the wiringPiSetup() function you used.
 * Use 100 for the pwmRange, then the value can be anything from 0 (off) to 100 (fully on) for the given pin.
 * The return value is 0 for success.
 * Anything else and you should check the global errno variable to see what went wrong.
 *
 * NOTE: Each “cycle” of PWM output takes 10mS with the default range value of 100, so trying to change the PWM value more than 100 times a second will be futile.
 *
 * NOTE: Each pin activated in softPWM mode uses approximately 0.5% of the CPU.
 *
 * NOTE: You need to keep your program running to maintain the PWM output!
 * @param  pin
 * @param  value
 * @param range
 */
wpi.softPwmCreate = function softPwmCreate(pin, value, range) {
  return _wpi.softPwmCreate(pin, value, range);
};


/**
 * This updates the PWM value on the given pin.
 * The value is checked to be in-range and pins that haven’t previously been initialised via softPwmCreate will be silently ignored.
 * @param  pin
 * @param  value
 */
wpi.softPwmWrite = function softPwmWrite(pin, value) {
  return _wpi.softPwmWrite(pin, value);
};


/**
 * @param  pin
 */
wpi.softPwmStop = function softPwmStop(pin) {
  return _wpi.softPwmStop(pin);
};


/**
 * @param  pin
 * @param  value
 */
wpi.softServoWrite = function softServoWrite(pin, value) {
  return _wpi.softServoWrite(pin, value);
};


/**
 * @param  p0
 * @param  p1
 * @param  p2
 * @param  p3
 * @param  p4
 * @param  p5
 * @param  p6
 * @param  p7
 */
wpi.softServoSetup = function softServoSetup(p0, p1, p2, p3, p4, p5, p6, p7) {
  return _wpi.softServoSetup(p0, p1, p2, p3, p4, p5, p6, p7);
};


/**
 * This creates a software controlled tone pin.
 * You can use any GPIO pin and the pin numbering will be that of the wiringPiSetup() function you used.
 * The return value is 0 for success.
 * Anything else and you should check the global errno variable to see what went wrong.
 *
 * NOTE: Each pin activated in softTone mode uses approximately 0.5% of the CPU.
 *
 * NOTE: You need to keep your program running to maintain the sound output!
 * @param  pin
 */
wpi.softToneCreate = function softToneCreate(pin) {
  return _wpi.softToneCreate(pin);
};


/**
 * This updates the tone frequency value on the given pin.
 * The tone will be played until you set the frequency to 0.
 * @param  pin
 * @param  frequency
 */
wpi.softToneWrite = function softToneWrite(pin, frequency) {
  return _wpi.softToneWrite(pin, frequency);
};


/**
 * @param  pin
 */
wpi.softToneStop = function softToneStop(pin) {
  return _wpi.softToneStop(pin);
};
