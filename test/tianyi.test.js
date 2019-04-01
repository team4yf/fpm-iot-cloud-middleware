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
  "services": [
    {
      "serviceId": "Header",
      "serviceType": "Header",
      "data": {
        "VID": 221,
        "UID": 3,
        "PID": 3,
        "SID": -66052, // 0xfffefdfc, // -66052
        "FN": 5,
        "EXTRA": 13
      },
      "eventTime": "20170214T170220Z"
    },
    {
      "serviceId": "Payload",
      "serviceType": "Payload",
      "data": {
        "LENGTH": 5,
        "DATA_1": 0x74657374,
        "DATA_2": 0x10000000,
        "DATA_3": 1,
        "DATA_4": 5,
        "DATA_5": 13
      },
      "eventTime": "20170214T170220Z"
    }
  ]
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
    assert.strictEqual(sid, 'fffefdfc', 'sid should be 0xfffefdfc');
    assert.strictEqual(fn, 0x05, 'fn should be 0x05');
    assert.strictEqual(extra, 13, 'extra should be 13');
    assert.strictEqual(payload, '7465737410', 'payload should be 7465737410');
    done()
  })

  it('encode', function( done) {

    const origin = '62386239326363372d323632322d346632372d613234622d30343161623236663062383005001305fffefdfc01';
    const packet = encode(origin);
    const { deviceId, params, payload } = packet;
    const { FN, EXTRA, LENGTH, DATA_1 } = params;
    console.log(params)
    assert.strictEqual(deviceId, 'b8b92cc7-2622-4f27-a24b-041ab26f0b80', 'deviceId should be b8b92cc7-2622-4f27-a24b-041ab26f0b80');
    assert.strictEqual(FN, 0x05, 'fn should be 0x05');
    assert.strictEqual(EXTRA, 0x13, 'extra should be 0x13');
    assert.strictEqual(LENGTH, 5, 'LENGTH should be 5');
    assert.strictEqual(DATA_1, 0xfffefdfc, 'DATA_1 should be 0xfffefdfc');
    assert.strictEqual(payload, 'fffefdfc01', 'payload should be fffefdfc01');

    done();
  })

})