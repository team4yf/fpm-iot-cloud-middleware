const net = require('net');
const _ = require('lodash');

const LOCAL_HOST = 'localhost';

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
    data = data || Buffer.from(`ee00000300000004ffffffff010000${Buffer.from(JSON.stringify({ "sn_id":"abcdefgh", "opcode": 1001, "device_type": 20, "min_wind_dir": 0, "avg_wind_dir": 0, "max_wind_dir": 0, "min_wind_speed": 0, "avg_wind_speed": 0, "max_wind_speed": 2, "temp": 253, "humidity": 597, "pressure": 10087, "rainfall": 0, "radiation": 0, "u-rays": 0, "noise": 562, "pm2.5": 0, "pm10": 0 })).toString('hex')}`, 'hex')
    console.info(data.toString('hex'), data)
    client.write(data);
}

const run = (client) => {
    intervalHandle = setInterval( () => {send(client)}, 10 * 1000)
}

const reconnect = () => {
    console.info('------------- Trying to reconnect', new Date().toLocaleString());
    create()
}

const create = () => {
    let client = net.createConnection({ host: LOCAL_HOST, port: PORT, timeout: 9 * 1000 }, () =>{
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






