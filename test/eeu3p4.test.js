const assert = require('assert');
const { decoder, hex2JSON } = require("../source/kit.js");

String.prototype.trim = function(){
  return this.replace(/\s/g, '');
}
const data = "ee 00 00 03 00 00 00 04 ff fe fd fc 01 00 00 7b 22 61 22 3a 31 7d".trim();
console.log(data)
describe('ee-u3-p4 Protocol Test', function(){

  it('0xee Version', function(done){
    const origin = data;
    const packet = decoder(origin);
    //
    const { header, payload } = packet;
    //vid: 0, uid, pid, nb, sid, fn, extra
    const { vid, uid, pid, sid, fn, extra } = header;
    console.log(packet)
    assert.strictEqual(vid, 0xee, 'VID should be ee');
    assert.strictEqual(uid, 3, 'uid should be 3');
    assert.strictEqual(pid, 4, 'pid should be 4');
    assert.strictEqual(sid, 'fffefdfc', 'sid should be fffefdfc');
    assert.strictEqual(fn, 0x01, 'fn should be 0x01');
    assert.strictEqual(extra, 0, 'extra should be 0');
    assert.strictEqual(payload, '7b2261223a317d', 'payload should be 7b2261223a317d');
    const json = hex2JSON(payload);
    assert.strictEqual(json.a, 1, 'Payload should be {a:1}');

    done()
  })

  it('payload test', function(done){
    const payloadJSON = {message:'010203', channel: 'foo', ids: '0102,0103'};
    const payloadBuf = Buffer.from(JSON.stringify(payloadJSON))
    const origin = `${ '00 00 00 03 00 00 00 03 03 56 56 60 78 09 54 60'.trim()}${payloadBuf.toString('hex')}`;
    const packet = decoder(origin);
    const { payload } = packet;
    const data = hex2JSON(payload);
    assert.strictEqual(data.message, '010203', "{message:'010203', channel: 'foo', ids: '0102,0103'}");
    done()
  })

})