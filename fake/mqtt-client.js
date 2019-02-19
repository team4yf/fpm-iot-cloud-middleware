const mqtt = require('mqtt');
const config = require('../config.default.json').mqttserver;
const { host, port } = config;

const client = mqtt.connect(`mqtt://${host}:${port}`, config);


client.subscribe(['$d2s/u3/p4/tcp']);

// client.subscribe('$s2d/nb/youren/push');
client.on('message', (topic, payload) => {
	console.log(topic, payload)
})