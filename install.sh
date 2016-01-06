#!/bin/bash

platform='unknown'
unamestr=`uname`
if [[ "$unamestr" == 'Linux' ]]; then
   platform='linux'
fi

if [[ $platform == 'linux' ]]; then
   npm i wiring-pi
else
   tput setaf 1; echo "WARNING: 'wiring-pi' is required, but it can only be installed in linux@rpi."
fi
