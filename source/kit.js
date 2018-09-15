const _ = require('lodash');

exports.decoder = hex => {
    // src is a buffer array
    // ex: 01 02 03 04, 01 02 03 04, 01 02 03 04, | ....
    // it's contains UID!4B, PID!4B, NB!15B, SID!4B, DATA!?B
    // 

    if(_.isString(hex)){
        hex = Buffer.from(hex, 'hex');
    }
    if(!Buffer.isBuffer(hex)){
        return { header: { uid: -1, pid: -1, nb: -1, sid: -1}, payload: Buffer.from([0,0,0,0])}
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