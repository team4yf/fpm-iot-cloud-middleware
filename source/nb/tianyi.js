/**
 * The protocol for tianyi iot platform.
 */
const _ = require('lodash');
const assert = require('assert');
const debug = require('debug')('fpm-iot-cloud-middleware:protocol-tianyi');

const { decoder, encoder } = require('../protocols');

/*
The Data Body:
Body:
{
  "notifyType": "deviceDatasChanged",
  "requestId": null,
  "deviceId": "b8b92cc7-2622-4f27-a24b-041ab26f0b80",
  "gatewayId": "b8b92cc7-2622-4f27-a24b-041ab26f0b80",
  "services": {
    "serviceId": "Header",
    "serviceType": "Header",
    "data": {
      "VID": 221,
      "UID": 3,
      "PID": 3,
      "SID": 0xfffcfdfe,
      "FN": 5,
      "EXTRA": 13，
      "LENGTH": 4,
      "DATA_1": 3,
      "DATA_2": 3,
      "DATA_3": 1,
      "DATA_4": 5,
      "DATA_5": 13
    },
    "eventTime": "20170214T170220Z"
  }
}

//*/

exports.decode = ( body, needHead = true ) => {
  
  try {
    const { deviceId, gatewayId, service } = body;
    assert(!!service, 'service should required~');

    const { serviceId, data } = service;
    if( serviceId !== 'Payload'){
      debug('ignore the serviceId:%o', serviceId);
      return;
    }

    const header = { 
      nb: deviceId, 
      gatewayId ,
      vid: data.VID,
      uid: data.UID,
      pid: data.PID,
      sid: data.SID,
      fn: data.FN,
      extra: data.EXTRA,
    };
    const { LENGTH } = data;
    const max = Math.ceil(parseInt(LENGTH)/4);

    let payload = Buffer.allocUnsafe(max * 4);

    _.map(_.range(1, max + 1), index => {
      payload.writeInt32BE(data[`DATA_${index}`], (index - 1) * 4 )
    });
    payload = payload.slice(0, LENGTH);
    
    const { vid, sid } = header;

    assert(!!vid, 'VID required');
    assert(!!sid, 'SID required');

    // 用 补码 的方式转换16进制的数据

    // FixBug here
    if(sid < 0){
      header.sid = (0xffffffff + sid + 1).toString(16);  
    }else{
      header.sid = sid.toString(16);
    }
    header.sid = _.padStart(header.sid, 8, '0');
    // use the special protocol for parse the data .
    if(needHead && data.VID != 0x11){
      const headerBuf = Buffer.allocUnsafe(7);
      headerBuf.writeInt32BE(data.SID)
      headerBuf.writeUInt8(data.FN, 4)
      headerBuf.writeInt16BE(data.EXTRA, 5);

      // debug('headerBuffer, %s', headerBuf.toString('hex'))
      payload = Buffer.concat([ headerBuf, payload])
    }
    
    return {
      header,
      payload: payload.toString('hex'),
    }
  } catch (error) {
    debug('DECODE ERROR: %O', error)
    throw error;
  }
  
}

exports.encode = hex => {
  try {
    assert(!!hex, 'Hex should required~');
    const hexStr = hex.toString();
    debug('the input hex: %O, hexStr: %s', hex, hexStr);
    assert(typeof(hexStr) === 'string', `Hex should be string: the actual type:${typeof(hexStr)}`);
    const parts = hexStr.split('|');
    assert(parts.length === 2, 'Hex should be split by | ');
    const deviceId = parts[0];

    let buf = Buffer.from(parts[1], 'hex');
    assert(buf.length > 3, 'Hex size should > 3');
    const FN = buf.readInt8(0);
    const EXTRA = buf.readInt16BE(1);
    const LENGTH = buf.readInt8(3);
    const payload = buf.slice(4, 4 + LENGTH);
    
    const params = {
      FN, EXTRA, LENGTH,
    };

    const max = Math.ceil(LENGTH / 4);
    const delta = max * 4 - LENGTH;

    let concatedPayload;
    if(delta > 0){
      concatedPayload = Buffer.concat( [payload, Buffer.from(_.fill(Array(delta), 0x00 ))] )
    }else{
      concatedPayload = payload;
    }
    _.map(_.range(1, max + 1), index => {
      params[`DATA_${index}`] = concatedPayload.readUInt32BE( (index - 1) * 4);
    })

    return {
      deviceId, params,
    }
  } catch (error) {
    debug('ENCODE ERROR: %O', error)
    throw error;
  }
  
}