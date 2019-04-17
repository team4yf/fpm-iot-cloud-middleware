/**
 * The protocol 11
 * 主要应对 智能监控箱为主 的物联网运维项目
 */
const _ = require('lodash');
const assert = require('assert');
const debug = require('debug')('fpm-iot-cloud-middleware:protocol-00');

const MIN_DATA_LENGTH_P_0 = 15; // 15b
const MAX_DATA_LENGTH_P_0 = 70; // 70b

exports.decode = (hex) => {
  try{
    if(typeof(hex) === 'string'){
      hex = Buffer.from(hex, 'hex');
    }
    assert(hex.length >= MIN_DATA_LENGTH_P_0, `The hex data is too short. It's at least ${MIN_DATA_LENGTH_P_0} bytes`)
    assert(hex.length <= MAX_DATA_LENGTH_P_0, `The hex data is too longer. It's at most ${MAX_DATA_LENGTH_P_0} bytes`)
    const uid = hex.readUIntBE(1, 3);   // the message user id
    const pid = hex.readUIntBE(4, 4);   // the project id
    const sid = hex.toString('hex', 8, 8 + 4);    // the device sn id
    const fn = hex.readUIntBE(12, 1);   // the function code
    const extra = hex.readUIntBE(13, 2);   // the extra data
    const data = hex.slice(8); // the message origin data

    return { header: { vid: 0x11, uid, pid, sid, fn, extra }, payload: data.toString('hex') };
  }catch(error){
    debug('Decode Error: %O', error);
    throw error;
  }
}

exports.encode = (hex) => {
  // TODO, define the logic
  return hex;
}
