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

module.exports = ( body ) => {
  
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
        dataArr = new Int32Array(max);
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

    header.sid = sid.toString(16);

    // use the special protocol for parse the data .
    return {
      header,
      payload: payload.toString('hex'),
    }
  } catch (error) {
    throw error;
  }
  
}