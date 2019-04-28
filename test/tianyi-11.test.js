const assert = require('assert');
const { decode, encode } = require("../source/protocols/tianyi.js");
const { decoder } = require("../source/protocols");

const debug = require('debug')('TEST');
String.prototype.trim = function(){
  return this.replace(/\s/g, '');
}
const BODY = {
  "notifyType": "deviceDatasChanged",
  "requestId": null,
  "deviceId": "b8b92cc7-2622-4f27-a24b-041ab26f0b80",
  "gatewayId": "b8b92cc7-2622-4f27-a24b-041ab26f0b80",
  "service": {
    "serviceId": "Payload",
    "serviceType": "Payload",
    "data": {
      "VID": 0x11,
      "UID": 1,
      "PID": 1,
      "SID": -66052, // 0xfffefdfc, // -66052
      "FN": 0xaa,
      "EXTRA": 0x0013,
      "LENGTH": 12,
      "DATA_1": -66052,
      "DATA_2": 0xaa001374,
      "DATA_3": 0x65737410,
      "DATA_4": 0x11111111,
      "DATA_5": 0,
      "DATA_6": 67072,
      "DATA_7": 0,
    },
    "eventTime": "20170214T170220Z"
  }
}

describe('Tianyi Protocol 11 Test', function(){

  it('decode', async () => {
    try {
      const packet = decode(BODY);
      //
      const { header, payload } = packet;
      debug('header: %O, payload: %O', header, payload);
      //vid: 0, uid, pid, nb, sid, fn, extra
      const { vid, uid, pid, nb, sid, fn, extra } = header;
      // const decodedPacket = decoder(payload);

      assert.strictEqual(vid, 0x11, 'VID should be 11');
      assert.strictEqual(uid, 1, 'uid should be 1');
      assert.strictEqual(pid, 1, 'pid should be 1');
      assert.strictEqual(nb, 'b8b92cc7-2622-4f27-a24b-041ab26f0b80', 'NB should be b8b92cc7-2622-4f27-a24b-041ab26f0b80');
      assert.strictEqual(sid, 'fffefdfc', 'sid should be 0xfffefdfc');
      assert.strictEqual(fn, 0xaa, 'fn should be 0xaa');
      assert.strictEqual(extra, 0x0013, 'extra should be 0013');
      assert.strictEqual(payload.toString('hex'), 'fffefdfcaa00137465737410', 'payload should be fffefdfcaa00137465737410');
    } catch (error) {
     throw error; 
    }
  })

  it('encode', function( done) {

    const origin = '141c0c85-24ca-4d2d-bf57-7e45591a3b88|05001308fffefdfc01000000';
    const packet = encode(origin);
    const { deviceId, params } = packet;
    const { FN, EXTRA, LENGTH, DATA_1, DATA_2 } = params;
    // console.log(params)
    assert.strictEqual(deviceId, '141c0c85-24ca-4d2d-bf57-7e45591a3b88', 'deviceId should be 141c0c85-24ca-4d2d-bf57-7e45591a3b88');
    assert.strictEqual(FN, 0x05, 'fn should be 0x05');
    assert.strictEqual(EXTRA, 0x13, 'extra should be 0x13');
    assert.strictEqual(LENGTH, 8, 'LENGTH should be 8');
    assert.strictEqual(DATA_1, 0xfffefdfc, 'DATA_1 should be 0xfffefdfc');
    assert.strictEqual(DATA_2, 0x01000000, 'DATA_2 should be 0x01000000');

    done();
  })

})