/**
 * The protocol for tianyi iot platform.
 */
const _ = require('lodash');
const assert = require('assert');
const debug = require('debug')('fpm-iot-cloud-middleware:protocol-dd');

/*
The Data Body:
Body:
{
  "notifyType": "deviceDatasChanged",
  "requestId": null,
  "deviceId": "b8b92cc7-2622-4f27-a24b-041ab26f0b80",
  "gatewayId": "b8b92cc7-2622-4f27-a24b-041ab26f0b80",
  "services": [
    {
      "serviceId": "Header",
      "serviceType": "Header",
      "data": {
        "VID": 221,
        "UID": 3,
        "PID": 3,
        "SID": 0xfffcfdfe,
        "FN": 5,
        "EXTRA": 13
      },
      "eventTime": "20170214T170220Z"
    },
    {
      "serviceId": "Payload",
      "serviceType": "Payload",
      "data": {
        "LENGTH": 4,
        "DATA_1": 3,
        "DATA_2": 3,
        "DATA_3": 1,
        "DATA_4": 5,
        "DATA_5": 13
      },
      "eventTime": "20170214T170220Z"
    }
  ]
}

//*/

exports.decode = ( body ) => {
  
  try {
    const { deviceId, gatewayId, services } = body;
    const header = { nb: deviceId, gatewayId };
    let payload;
    assert(_.size(services) === 2, 'Services should be 2 packages');

    _.map(services, service => {
      const { serviceId, data } = service;
      if(serviceId === 'Header'){
        _.map(data, (v, k) => {
          header[k.toLowerCase()] = v;
        })
        return;
      }
      if(serviceId === 'Payload'){
        const { LENGTH } = data;
        const max = Math.ceil(parseInt(LENGTH)/4);
        payload = Buffer.allocUnsafe(max * 4);
        _.map(_.range(1, max + 1), index => {
          payload.writeInt32BE(data[`DATA_${index}`], (index - 1) * 4 )
        });
        payload = payload.slice(0, LENGTH);
        return;
      }
    });
    const { vid, sid } = header;

    assert(!!vid, 'VID required');
    assert(!!sid, 'SID required');
    header.sid = (0xffffffff + sid + 1).toString(16);
    // use the special protocol for parse the data .
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
    assert(typeof(hex) === 'string', `Hex should be string: the actual type:${typeof(hex)}`);
    const parts = hex.split('|');
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
      deviceId, params, payload: payload.toString('hex'),
    }
  } catch (error) {
    debug('ENCODE ERROR: %O', error)
    throw error;
  }
  
}