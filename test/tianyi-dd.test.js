const assert = require('assert');
const { decode, encode } = require("../source/protocols/tianyi.js");

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

  it('decode', function(done){
    const packet = decode(BODY);
    //
    const { header, payload } = packet;
    //vid: 0, uid, pid, nb, sid, fn, extra
    const { vid, uid, pid, nb, sid, fn, extra } = header;
    assert.strictEqual(vid, 0xdd, 'VID should be 0');
    assert.strictEqual(uid, 3, 'uid should be 3');
    assert.strictEqual(pid, 3, 'pid should be 3');
    assert.strictEqual(nb, 'b8b92cc7-2622-4f27-a24b-041ab26f0b80', 'NB should be b8b92cc7-2622-4f27-a24b-041ab26f0b80');
    assert.strictEqual(sid, '066aff30', 'sid should be 066aff30');
    assert.strictEqual(fn, 0x05, 'fn should be 0x05');
    assert.strictEqual(extra, 0x13, 'extra should be 13');
    assert.strictEqual(payload, '066aff300500137465737410', 'payload should be 7465737410');
    done()
  })

  it('encode', function( done) {

    const origin = '141c0c85-24ca-4d2d-bf57-7e45591a3b88|05001308fffefdfc01000000';
    const packet = encode(origin);
    const { deviceId, params } = packet;
    const { FN, EXTRA, LENGTH, DATA_1, DATA_2 } = params;
    console.log(params)
    assert.strictEqual(deviceId, '141c0c85-24ca-4d2d-bf57-7e45591a3b88', 'deviceId should be 141c0c85-24ca-4d2d-bf57-7e45591a3b88');
    assert.strictEqual(FN, 0x05, 'fn should be 0x05');
    assert.strictEqual(EXTRA, 0x13, 'extra should be 0x13');
    assert.strictEqual(LENGTH, 8, 'LENGTH should be 8');
    assert.strictEqual(DATA_1, 0xfffefdfc, 'DATA_1 should be 0xfffefdfc');
    assert.strictEqual(DATA_2, 0x01000000, 'DATA_2 should be 0x01000000');

    done();
  })

})