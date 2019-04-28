/**
 * The protocol for tianyi iot platform.
 * 该协议说明：Common-tianyi.md
 */
const _ = require('lodash');
const assert = require('assert');
const debug = require('debug')('fpm-iot-cloud-middleware:protocol-tianyi');

const fields = 'VID,UID,PID,SID,FN,EXTRA,LENGTH'.split(',');

const fieldsMap = {};

_.map(fields, field => {
  fieldsMap[field.toLowerCase()] = field;
})
/**
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

/**
 * 将无符号的整数转换诚有符号的整数，也就是通常的补码算法
 * 如果是 > 0 的数，则直接返回该数
 * 算法主要针对 < 0 的，也就是 f 开头的数
 * 用全是 ff 的数 + 该数据 + 1
 * 0xffff + src + 1 
 * @param {*} uint 
 */
const convertInt2UInt = ( num, max ) => {
  if( num >= 0) {
    return num;
  }

  return max + num + 1;
}

/**
 * 给二进制的字符串，在前面补0，以沾满字节
 * @param {} hexString 
 * @param {*} byte 
 * @param {*} str 
 */
const paddingZero = ( hexString, byte = 2, str = '0') => {
  if( typeof (hexString) == 'number'){
    hexString = hexString.toString(16);
  }
  return _.padStart(hexString, 2 * byte, str);
}

exports.decode = ( body, needHead = true ) => {

  try {
    const { deviceId, gatewayId, service } = body;
    assert(!!service, 'service should required~');

    // Ignore the data packet if the id is not 'Payload'
    const { serviceId, data } = service;
    if( serviceId !== 'Payload'){
      debug('ignore the serviceId:%o', serviceId);
      return;
    }

    // get all data of the packet, lowercase the key;
    const tempData = {};
    _.map(fieldsMap, (upKey, key) => {
      tempData[key] = data[upKey]
    })

    const { sid, vid, pid, uid, fn, extra, length } = tempData;

    assert(!!vid, 'VID required');
    assert(!!sid, 'SID required');

    const header = {
      nb: deviceId,
      gatewayId ,
      vid,
      uid,
      pid,
      sid,
      fn,
      extra,
    };
    // make a buffer of the length.
    const max = Math.ceil(parseInt(length)/4);
    debug('the actual data length: %d, max data length: %d x 4', length, max);
    let payload = Buffer.allocUnsafe(max * 4);

    // 将数据填充到 Buffer 中
    _.map(_.range(1, max + 1), index => {
      payload.writeUInt32BE(convertInt2UInt(data[`DATA_${index}`], 0xffffffff), (index - 1) * 4 )
    });
    // 去除超出max的数据
    payload = payload.slice(0, length);

    // use the special protocol for parse the data .

    /*
    if(needHead && data.VID != 0x11){
      const headerBuf = Buffer.allocUnsafe(7);
      headerBuf.writeUInt32BE(header.sid)
      headerBuf.writeUInt8(header.fn, 4)
      headerBuf.writeUInt16BE(header.extra, 5);

      // debug('headerBuffer, %s', headerBuf.toString('hex'))
      payload = Buffer.concat([ headerBuf, payload])
    }
    //*/

    // 用 补码 的方式转换16进制的数据
    header.sid = convertInt2UInt(header.sid, 0xffffffff);
    // 转换成字符串
    header.sid = paddingZero(header.sid, 4);

    return {
      header,
      payload,
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