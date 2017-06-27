const fs = require('fs');
/**
 * Default pi-blaster file path
 * @type {String}
 */
const PI_BLASTER_PATH = '/dev/pi-blaster';

const noop = () => {
};

/**
 * We need to use write() with a buffer so that we can pass the position=-1 argument.
 * This is needed, otherwise we get an error because node default write tries to seek
 * in the file which is not possible (it's a FIFO).
 * @param {String} cmd Command to be written
 * @param {Function} callback Must accept only one optional error parameter
 */
function writeCommand(cmd, callback) {
  callback = callback || noop;
  const buffer = new Buffer(cmd + '\n');
  fs.open(PI_BLASTER_PATH, 'w', undefined, function (err, fd) {
    if (err) {
      return callback(err)
    }
    fs.write(fd, buffer, 0, buffer.length, -1, function (error, written, buffer) {
      if (error) {
        return callback(error)
      }
      fs.close(fd);
      callback()
    });
  });
}

function writeCommandSync(cmd) {
  const buffer = new Buffer(cmd + '\n');
  const fd = fs.openSync(PI_BLASTER_PATH, 'w', undefined);
  const result = fs.writeSync(fd, buffer, 0, buffer.length, -1);
  fs.closeSync(fd);
  return result;
}

/**
 * Async set a given pin to a given value
 * @param {Number} pin Target pin {@link https://github.com/sarfata/pi-blaster/blob/master/pi-blaster.c#L39-51|Known pins}
 * @param {Number} value Must be between 0 and 1
 * @param {Function} callback Must accept only one optional error parameter
 */
function write(pin, value, callback) {
  writeCommand(pin + '=' + value, callback);
}

/**
 * Sync set a given pin to a given value
 * @param {Number} pin Target pin {@link https://github.com/sarfata/pi-blaster/blob/master/pi-blaster.c#L39-51|Known pins}
 * @param {Number} value Must be between 0 and 1
 */
function writeSync(pin, value) {
  return writeCommandSync(pin + '=' + value);
}

/**
 * Async release a pin (after release, this pin can be used by others as a regular GPIO pin)
 * @param {Number} pin Target pin {@link https://github.com/sarfata/pi-blaster/blob/master/pi-blaster.c#L39-51|Known pins}
 * @param {Function} callback Must accept only one optional error parameter
 */
function release(pin, callback) {
  writeCommand('release ' + pin, callback);
}

/**
 * Sync release a pin (after release, this pin can be used by others as a regular GPIO pin)
 * @param {Number} pin Target pin {@link https://github.com/sarfata/pi-blaster/blob/master/pi-blaster.c#L39-51|Known pins}
 */
function releaseSync(pin) {
  writeCommandSync('release ' + pin);
}

module.exports = {
  write,
  writeSync,
  release,
  releaseSync
};
