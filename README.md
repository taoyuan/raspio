# raspio

> A raspberry GPIO advanced library for Node.js

## Installation

### Step 1

The pigpio package is based on [the pigpio C library](https://github.com/joan2937/pigpio) so the C library needs to be installed first. Version V41 or higher of the pigpio C library is required. It can be installed with the following commands:

```sh
wget abyz.co.uk/rpi/pigpio/pigpio.zip
unzip pigpio.zip
cd PIGPIO
make
sudo make install
```

or

```sh
git clone https://github.com/joan2937/pigpio
cd pigpio
make
sudo make install
```

Note that the `make` command takes a while to complete so please be patient.

### Step 2


