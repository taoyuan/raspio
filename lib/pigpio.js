const Pigpio = require('js-pigpio');
const PromiseA = require('bluebird');

const cache = {};

exports.connect = function (host, port) {
  host = host || '127.0.0.1';
  if (host === 'localhost') {
    host = '127.0.0.1'
  }
  const parts = host.split(':');
  host = parts[0];
  if (parts.length === 2) {
    port = port || parts[1];
  }
  port = port || 8888;
  const uri = `${host}:${port}`;
  if (cache[uri]) {
    return cache[uri];
  }
  const pigpio = new Pigpio();
  const close = pigpio.close;
  pigpio.close = function () {
    close.call(this);
    delete(cache[uri]);
  };
  pigpio.$ready = PromiseA.fromCallback(cb => pigpio.pi(host, port, cb)).catch(err => {
    if (/ENOTFOUND/.test(err.message)) {
      console.error(err);
    } else {
      throw err;
    }
  });
  return cache[uri] = pigpio;
};
