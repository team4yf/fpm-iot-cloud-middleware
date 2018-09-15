const _ = require('lodash');

exports.decoder = hex => {
    // hex is a buffer array
    // see the protocol at README.md file
    if(_.isString(hex)){
        hex = Buffer.from(hex, 'hex');
    }
    if(!Buffer.isBuffer(hex)){
        return { header: { uid: -1, pid: -1, nb: -1, sid: -1, fn: -1, extra: -1}, payload: Buffer.from([0,0,0,0,0,0,0,0])}
    }
    try{
        const uid = hex.readUIntBE(0, 4);
        const pid = hex.readUIntBE(4, 4);
        // normally the nb id is a string with 15 numbers
        let nb = hex.toString('hex', 8, 8 + 8);
        // so, we should substring it
        nb = nb.substring(1);
        const sid = hex.toString('hex', 16, 16 + 4);
        const fn = hex.readUIntBE(20, 1);
        const extra = hex.readUIntBE( 21, 2);
        const data = hex.slice(16);

        return { header: { uid, pid, nb, sid, fn, extra }, payload: data.toString('hex') }
    }catch(e){
        console.error(e);
        return { header: { uid: -1, pid: -1, nb: -1, sid: -1, fn: -1, extra: -1}, payload: Buffer.from([0,0,0,0,0,0,0,0])}
    }
}