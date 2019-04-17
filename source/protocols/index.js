/**
 * The protocols common encoder
 */
const _ = require('lodash');
const assert = require('assert');
const debug = require('debug')('fpm-iot-cloud-middleware:protocol-index');
const MAX_DATA_LENGTH = 64 * 1024; // 64kb
const fs = require('fs');
const path = require('path');

const checkProtocolExists = (vid) => {
  const paddingVid = _.pad(vid, 2, '0')
  return fs.existsSync(path.join(__dirname, `v_${paddingVid}.js`));
}

exports.decoder = hex => {
  try {
    assert(!!hex, `The hex is Undefined`)
    // hex is a buffer array
    // see the protocol at README.md file
    if(typeof(hex) === 'string'){
      hex = Buffer.from(hex, 'hex');
    }
    assert(Buffer.isBuffer(hex), `The hex type is ${ typeof hex } ! It can be decode .`)
    assert(hex.length <= MAX_DATA_LENGTH, `The hex data is too large. 64 KB limit`)
    
    const vid = hex.toString('hex', 0, 1);   // the protocol version
    assert(checkProtocolExists(vid), `The protocol version: ${ vid } not implement!`);

    const { decode } = require(`./v_${ _.pad(vid, 2, '0') }.js`)

    assert(!!decode, `the decoder of the protocol v:${ vid } not exists`);
    return decode(hex);
  } catch (error) {
    debug('parse message data error: %O', error);
    throw error;
  }
  
}

exports.hex2JSON = hex => {
  try {
    assert(!!hex, `The hex is Undefined`)
    // hex is a buffer array
    // see the protocol at README.md file
    if(typeof(hex) === 'string'){
      hex = Buffer.from(hex, 'hex');
    }
    assert(Buffer.isBuffer(hex), `The hex type is ${ typeof hex } ! It can be decode .`)
    const str = hex.toString('ascii');
    return JSON.parse(str);

  } catch (error) {
    debug('hex2JSON error: %O', error);
    throw error;
  }
}