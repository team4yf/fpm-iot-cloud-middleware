const _ = require('lodash');

const TAG = '[Decoder]:';
const MIN_DATA_LENGTH_P_0 = 25; // 25b
const MIN_DATA_LENGTH_P_FF = 5; // 5b
const MAX_DATA_LENGTH = 64 * 1024; // 64kb

const protocols = {
    0x0: hex => {
        if(hex.length < MIN_DATA_LENGTH_P_0){
            console.error(TAG, `The hex data is too short. It's at least ${MIN_DATA_LENGTH_P_0} bytes`, hex);
            return ;
        }
        try{
            const uid = hex.readUIntBE(1, 3);   // the message user id
            const pid = hex.readUIntBE(4, 4);   // the project id
            // normally the nb id is a string with 15 numbers
            let nb = hex.toString('hex', 8, 8 + 8); // the nb id ? optionial
            // so, we should substring it
            nb = nb.substring(1);
            const sid = hex.toString('hex', 16, 16 + 4);    // the device sn id
            const fn = hex.readUIntBE(20, 1);   // the function code
            const extra = hex.readUIntBE( 21, 2);   // the extra data
            const data = hex.slice(16); // the message origin data

            return { header: { vid: 0, uid, pid, nb, sid, fn, extra }, payload: data.toString('hex') };
        }catch(e){
            console.error(TAG, 'Exception:', e);
            return ;
        }
    },
    0xff: hex => {
        if(hex.length < MIN_DATA_LENGTH_P_FF){
            console.error(TAG, `The hex data is too short. It's at least ${MIN_DATA_LENGTH_P_FF} bytes`, hex);
            return ;
        }
        try{
            const uid = 1;   // the message user id
            const pid = 1;   // the project id
            // normally the nb id is a string with 15 numbers
            let nb = ''; // the nb id ? optionial
            const sid = hex.toString('hex', 0, 4);    // the device sn id
            const fn = hex.readUIntBE(4, 1);   // the function code
            const extra = hex.readUIntBE(5, 2);   // the extra data
            const data = hex; // the message origin data

            return { header: { vid: 0xff, uid, pid, nb, sid, fn, extra }, payload: data.toString('hex') };
        }catch(e){
            console.error(TAG, 'Exception:', e);
            return ;
        }
    }
}

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
    if(hex.length > MAX_DATA_LENGTH){
        console.error(TAG, `The hex data is too large. 64 KB limit`, hex);
        return ;
    }
    const vid = hex.readUIntBE(0, 1);   // the message protocol version
    const protocol = protocols[vid];
    if(protocol === undefined){
        console.error(TAG, `Vid: ${vid} Not Exists!, the origin data: ${ hex.toString('hex') }`)
        return ;
    }
    return protocol(hex);
}