const fs = require('fs');

function revision() {
  let boardrev = null;

  const cpuinfo = fs.readFileSync('/proc/cpuinfo', 'ascii', function(err) {
    if (err)
      throw err;
  });

  cpuinfo.toString().split(/\n/).find(line => {
    const match = line.match(/^Revision.*(.{4})/);
    if (match) {
      boardrev = parseInt(match[1], 16);
    }
    return Boolean(match);
  });

  switch (boardrev) {
    case 0x2:
    case 0x3:
      return "v1rev1";
      break;
    case 0x4:
    case 0x5:
    case 0x6:
    case 0x7:
    case 0x8:
    case 0x9:
    case 0xd:
    case 0xe:
    case 0xf:
      return "v1rev2";
      break;
    case 0x10:
    case 0x12:
    case 0x13:
    case 0x15:
    case 0x92:
    case 0x93:
    case 0xc1:
    case 0x1041:
    case 0x2042:
    case 0x2082:
      return "v2plus";
      break;
    default:
      throw new Error("Unable to determine board revision");
      break;
  }
}

module.exports = revision();
