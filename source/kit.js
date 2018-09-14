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
    const uid = hex.readUIntBE(0, 4);
    const pid = hex.readUIntBE(4, 4);
    const nb = hex.toString('utf8', 8, 8 + 15); // it should be a utf8 string with 15 bytes
    // const sid = hex.readUIntBE('utf8', 23, 4);
    const sid = hex.toString('hex', 23, 23 + 4);
    const data = hex.slice(23);

    return { header: { uid, pid, nb, sid }, payload: data.toString('hex') }
}