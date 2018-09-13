'use strict';
const { Fpm } = require('yf-fpm-server');

const mqtt = require('mqtt');

const { createTcp } = require('./tcp.js');

const { createNB } = require('./nb');

/* The Start: Create Fpm Server */
const fpmServer = new Fpm();

const biz = fpmServer.createBiz('0.0.1');

const client = mqtt.connect('mqtt://localhost:1883');

biz.addSubModules('mqtt', {
	// foo: async (args, ctx, before) => {
	// 	return 1
  // }
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