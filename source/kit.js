const _ = require('lodash');

exports.decoder = hex => {
    // src is a buffer array
    // ex: 01 02 03 04, 01 02 03 04, 01 02 03 04, | ....
    // it's contains UID!4B, PID!4B, SID!4B, DATA!?B
    // 

    if(_.isString(hex)){
        hex = Buffer.from(hex, 'hex');
    }
    if(!Buffer.isBuffer(hex)){
        return { header: { uid: -1, pid: -1, sid: -1}, payload: Buffer.from([0,0,0,0])}
    }
    const uid = hex.readUIntBE(0, 4);
    const pid = hex.readUIntBE(4, 4);
    const sid = hex.readUIntBE(8, 8);
    const data = hex.slice(16);

    return { header: { uid, pid, sid }, payload: data }
}