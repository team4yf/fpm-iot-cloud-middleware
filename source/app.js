'use strict';
const { Fpm } = require('yf-fpm-server');

const mqtt = require('mqtt');

const { createTcp } = require('./tcp.js');

const { createNB } = require('./nb');

/* The Start: Create Fpm Server */
const fpmServer = new Fpm();

const biz = fpmServer.createBiz('0.0.1');

/* Env > Config.json > Default Value */
const { MQTT_HOST = 'localhost', MQTT_PORT = 1883, MQTT_USERNAME = 'admin', MQTT_PASSWORD = '123123123' } = process.env;

const { host, port, username, password } = Object.assign(fpmServer.getConfig('mqttserver'), { 
  host: MQTT_HOST, 
  port: MQTT_PORT,
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD });


console.info('config:', { host, port, username, password })

const client = mqtt.connect(`mqtt://${host}:port`, { username, password });

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