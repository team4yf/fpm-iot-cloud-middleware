const _ = require('lodash');

const TAG = '[Decoder]:';
const MIN_DATA_LENGTH = 25;

exports.decoder = hex => {
    if(!hex){
        console.error(TAG, `The hex is Undefined`);
        return ;
    }
    // hex is a buffer array
    // see the protocol at README.md file
    if(_.isString(hex)){
        hex = Buffer.from(hex, 'hex');
    }
    if(!Buffer.isBuffer(hex)){
        // The hex data unreadable.
        console.error(TAG, `The hex type is ${ typeof hex } ! It can be decode .`, hex);
        return ;
    }
    if(hex.length < 25){
        console.error(TAG, `The hex data is too short. It's at least 25 bytes`, hex);
        return ;
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
        console.error(TAG, 'Exception:', e);
        return ;
    }
}