const assert = require('assert');
const axios = require('axios');
// mqtt client
const mqtt = require('mqtt');
const config = require('../config.default.json').mqttserver;
const { host, port } = config;
const debug = require('debug')('TEST')
const mqttClient = mqtt.connect(`mqtt://${host}:${port}`, config);

String.prototype.trim = function(){
  return this.replace(/\s/g, '');
}
const BODY = {
  "notifyType": "deviceDatasChanged",
  "deviceId": "b8b92cc7-2622-4f27-a24b-041ab26f0b80",
  "gatewayId": "b8b92cc7-2622-4f27-a24b-041ab26f0b80",
  "service": {
    "serviceId": "Payload",
    "serviceType": "Payload",
    "data": {
      "VID": 221,
      "UID": 3,
      "PID": 3,
      "SID": 0x066aff30, // 0xfffefdfc, // -66052
      "FN": 5,
      "EXTRA": 0x13,
      "LENGTH": 5,
      "DATA_1": 0x74657374,
      "DATA_2": 0x10000000,
      "DATA_3": 1,
      "DATA_4": 5,
      "DATA_5": 13
    },
    "eventTime": "20170214T170220Z"
  }
  
}

describe('Tianyi Protocol Test', function(){

  before( function(done) {
    
    mqttClient.subscribe(['$d2s/u3/p3/tianyi'], function(){
      done();
    })
    
  })

  after(function(done){
    mqttClient.end();
    done();

  })
  it('decode', function(done){
    axios.post('http://127.0.0.1:9992/webhook/tianyi/notify/datachange', BODY)
      .then(rsp => {
        console.log(rsp);
      })
    this.timeout(10 * 1000)
    mqttClient.on('message', (topic, payload) => {
      
      const message = JSON.parse(payload);
      debug('on data %s, %O', topic, message)
      assert(message.header.vid == 221, 'vid should be 0x11');
      done();
    })
  })

})