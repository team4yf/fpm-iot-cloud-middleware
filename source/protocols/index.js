/**
 * The protocols common encoder.
 * 此文件用于解析所有符合协议的数据流；
 * 数据流必须是 Buffer 格式的；
 * 以第一个字节作为数据的版本号，用于区分不同的数据解析方式；
 * 不同的版本以其名称作为文件名；
 * 每个版本协议中需要提供一个 decode 和 encode;
 * Decode 用于解析从设备上传到平台的数据
 * Encode 用于拼接应用下发给设备的数据
 * 目前已经使用的协议包括：
 * v11, vdd, vee
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
    if(vid === 'a0'){
      // this is heartbeat data, ignore anyway.
      return ;
    }
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

exports.concatHeader = (header, payload) => {
  let { vid } = header;
  vid = vid.toString(16)
  try {
    assert(checkProtocolExists(vid), `The protocol version: ${ vid } not implement!`);

    const { concatHeader } = require(`./v_${ _.pad(vid, 2, '0') }.js`)
    return concatHeader(header, payload);
  } catch (error) {
    debug('concatHeader error: %O', error);
    throw error;
  }
}