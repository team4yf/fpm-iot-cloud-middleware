const mqtt = require('mqtt');
const config = require('../config.default.json').mqttserver;
const { host, port } = config;

const client = mqtt.connect(`mqtt://${host}:${port}`, config);

// setInterval(function() {
// 	client.publish('$s2d/tcp/broadcast', JSON.stringify({ message: '0102030405', channel: '', ids: ''}), { qos: 1, retain: true});
// },10000);

client.publish('$s2d/nb/yiyuan/push', '31343163306338352d323463612d346432642d626635372d37653435353931613362383805001308fffefdfc01000000', { qos: 1, retain: true});

// client.subscribe('$s2d/nb/youren/push');
client.on('message', (topic, payload) => {
	console.log(topic, payload)
})