const should = require("chai").should();
const { decoder } = require("../source/kit.js");

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
    vid.should.equal(0);
    uid.should.equal(3);
    pid.should.equal(3);
    nb.should.equal('356566078095460');
    sid.should.equal('fffefdfc');
    fn.should.equal(0x05);
    extra.should.equal(0x0000);
    payload.should.equal('fffefdfc0500000100005392');

    done()
  })

})