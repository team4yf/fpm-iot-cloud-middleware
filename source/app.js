'use strict';
const { Fpm } = require('yf-fpm-server');

const mqtt = require('mqtt');

const { createTcp } = require('./tcp.js');

const { createNB } = require('./nb');

/* The Start: Create Fpm Server */
const fpmServer = new Fpm();

const biz = fpmServer.createBiz('0.0.1');

/* Env > Config.json > Default Value */
const { MQTT_HOST, MQTT_PORT, MQTT_USERNAME, MQTT_PASSWORD } = process.env;

const mqttserverOption = fpmServer.getConfig('mqttserver', { host: 'localhost', port: 1883, username: 'admin', password: '123123123'})
const { host, port, username, password } = Object.assign(mqttserverOption, { 
  host: MQTT_HOST || mqttserverOption.host, 
  port: MQTT_PORT || mqttserverOption.port,
  username: MQTT_USERNAME || mqttserverOption.username,
  password: MQTT_PASSWORD || mqttserverOption.password });


console.info('config:', { host, port, username, password })

const client = mqtt.connect(`mqtt://${host}:${port}`, { username, password });

biz.addSubModules('mqtt', {
  publish: args => {
    client.publish(args.topic, args.payload, { qos: 1, retain: true});
    return 1;
  }
});

fpmServer.addBizModules(biz);

fpmServer.run()
	.then(fpm => {
    createTcp(fpm);
    createNB(fpm);
    client.subscribe(['$s2d/tcp/push', '$s2d/nb/youren/push']);
    client.on('message', (topic, message) => {
      fpm.publish(topic, message)
    })
	});