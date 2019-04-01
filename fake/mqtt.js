const mqtt = require('mqtt');
const config = require('../config.default.json').mqttserver;
const { host, port } = config;

const client = mqtt.connect(`mqtt://${host}:${port}`, config);

// setInterval(function() {
// 	client.publish('$s2d/tcp/broadcast', JSON.stringify({ message: '0102030405', channel: '', ids: ''}), { qos: 1, retain: true});
// },10000);

client.publish('$s2d/nb/yiyuan/push', '141c0c85-24ca-4d2d-bf57-7e45591a3b88|05001308fffefdfc01000000', { qos: 1, retain: true});

// client.subscribe('$s2d/nb/youren/push');
client.on('message', (topic, payload) => {
	console.log(topic, payload)
})