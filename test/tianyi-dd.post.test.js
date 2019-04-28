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
    // curl -H "Content-Type:application/json" -X POST --data '{"notifyType": "deviceDatasChanged","deviceId": "b8b92cc7-2622-4f27-a24b-041ab26f0b80","gatewayId": "b8b92cc7-2622-4f27-a24b-041ab26f0b80","service": {"serviceId": "Payload","serviceType": "Payload","data": {"VID": 221,"UID": 3,"PID": 3,"SID": 0x066aff30, "FN": 5,"EXTRA": 0x13,"LENGTH": 5,"DATA_1": 0x74657374,"DATA_2": 0x10000000,"DATA_3": 1,"DATA_4": 5,"DATA_5": 13},"eventTime": "20170214T170220Z"}' http://127.0.0.1:9992/webhook/tianyi/notify/datachange

    this.timeout(10 * 1000)
    mqttClient.on('message', (topic, payload) => {
      debug('on data %s, %s', topic, payload)
      const message = JSON.parse(payload);
      assert(message.header.vid === 17, 'vid should be 0x11');
      done();
    })

    // const packet = decode(BODY);
    // //
    // const { header, payload } = packet;
    // //vid: 0, uid, pid, nb, sid, fn, extra
    // const concatedPayload = concatHeader(header, payload);
    // const { vid, uid, pid, nb, sid, fn, extra } = header;
    // assert.strictEqual(vid, 0xdd, 'VID should be 0');
    // assert.strictEqual(uid, 3, 'uid should be 3');
    // assert.strictEqual(pid, 3, 'pid should be 3');
    // assert.strictEqual(nb, 'b8b92cc7-2622-4f27-a24b-041ab26f0b80', 'NB should be b8b92cc7-2622-4f27-a24b-041ab26f0b80');
    // assert.strictEqual(sid, '066aff30', 'sid should be 066aff30');
    // assert.strictEqual(fn, 0x05, 'fn should be 0x05');
    // assert.strictEqual(extra, 0x13, 'extra should be 13');
    // assert.strictEqual(concatedPayload.toString('hex'), '066aff300500137465737410', 'payload should be 7465737410');
    // done()
  })

})