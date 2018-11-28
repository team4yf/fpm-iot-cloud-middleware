const net = require('net');
const _ = require('lodash');

const LOCAL_HOST = 'localhost';

const REMOTE_HOST = '192.168.100.196';

const PORT = 5001;

const ID = _.now();

let intervalHandle

let tryHandle

const send = ( client, data ) => {
    if(!client){
        if(intervalHandle){
            clearInterval(intervalHandle)
        }
        return
    }
    // data = data || Buffer.from('ff fe fd fc aa 00 11 00 00 00 00 00 00 00 01 00 00 00 00 01 29 00 00 00 37 0f'.split(' ').join(''), 'hex')
    // console.log('\n--------------------------------------- Send data, and the data package info is:\n\n', data,'\n toString():', data.toString('hex'), '\n\n--------------------------------------- @', new Date().toLocaleString(), '\n');
    // client.write(data);
    // //{"id":"fffefdfc","message":"fffefdfc03000200010011","callback":2}
    // data = Buffer.from('ff fe fd fc 03 00 02 00 11 00 00 00 00 00 00 00 01 00 00 00 00 01 29 00 00 00 f8 16'.split(' ').join(''), 'hex')
    // client.write(data);
    const nb = '0123456789012345'
    data = data || Buffer.from(`0000000100000002${nb}ffffffff01020301020304`, 'hex')
    console.info(data.toString('hex'), data)
    client.write(data);
    client.write(Buffer.from(`fffefdfcaa00010012000000000000000000000101012c00f2000080b3`, 'hex'));
}

const run = (client) => {
    intervalHandle = setInterval( () => {send(client)}, 10 * 1000)
}

const reconnect = () => {
    console.info('------------- Trying to reconnect', new Date().toLocaleString());
    create()
}

const create = () => {
    let client = net.createConnection({ host: REMOTE_HOST, port: PORT, timeout: 9 * 1000 }, () =>{
        console.log('------------- Connected! Ready To GO ...');
        if(intervalHandle){
            clearInterval(intervalHandle)
        }
        send(client)
        run(client);
    })
    client.on('data', (buf) => {
        // {"sn":"fffefdfc","op":"GET"}
        console.info('------------- Receive Data:\n', buf, '\n------------- @', new Date().toLocaleString());
    })
    client.on('error', (e) => {
        console.error('------------- Ops Exception:\n', 'Trying to reconnect in 10s')
        client.destroy();
        if(intervalHandle){
            clearInterval(intervalHandle)
        }
        // try to reconnect in 10s'
        tryHandle = setTimeout(reconnect, 10 * 1000)
    })
    return client
}

create()






