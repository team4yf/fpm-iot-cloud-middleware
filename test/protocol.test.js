const assert = require('assert');
const { decoder, hex2JSON } = require("../source/kit.js");

String.prototype.trim = function(){
  return this.replace(/\s/g, '');
}
const data = "00 00 00 03 00 00 00 03 03 56 56 60 78 09 54 60 ff fe fd fc 05 00 00 01 00 00 53 92".trim();
describe('Common Protocol Test', function(){

  it('0x00 Version', function(done){
    // 00 00 00 03 00 00 00 03 03 56 56 60 78 09 54 60 ff fe fd fc 05 00 00 01 00 00 53 92
    const origin = data;
    const packet = decoder(origin);
    //
    const { header, payload } = packet;
    //vid: 0, uid, pid, nb, sid, fn, extra
    const { vid, uid, pid, nb, sid, fn, extra } = header;
    assert.strictEqual(vid, 0, 'VID should be 0');
    assert.strictEqual(uid, 3, 'uid should be 3');
    assert.strictEqual(pid, 3, 'pid should be 3');
    assert.strictEqual(nb, '356566078095460', 'NB should be 356566078095460');
    assert.strictEqual(sid, 'fffefdfc', 'sid should be fffefdfc');
    assert.strictEqual(fn, 0x05, 'fn should be 0x05');
    assert.strictEqual(extra, 0, 'extra should be 0');
    assert.strictEqual(payload, 'fffefdfc0500000100005392', 'payload should be fffefdfc0500000100005392');
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