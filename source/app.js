'use strict';
const { Fpm } = require('yf-fpm-server');

const { createTcp } = require('./tcp.js');

const { createNB } = require('./nb');

const { createWebhook } = require('./webhook');

/* The Start: Create Fpm Server */
const fpmServer = new Fpm();

const biz = fpmServer.createBiz('0.0.1');

fpmServer.addBizModules(biz);

fpmServer.run()
	.then(fpm => {
    createTcp(fpm);
    createNB(fpm);
    createWebhook(fpm);
    fpm.execute('mqttclient.subscribe', 
      { topic: [
        '$s2d/tcp/push',
        '$s2d/tcp/broadcast',
        '$s2d/tcp/addChannel',
        '$s2d/nb/youren/push', 
        '$s2d/nb/yiyuan/push', 
        '$d2s/offline/tcp', 
        '$d2s/online/tcp'
      ]});

    fpm.subscribe('$d2s/offline/tcp', (topic, message) =>{
      fpm.publish('#socket/offline', message);
    });

    fpm.subscribe('$d2s/online/tcp', (topic, message) =>{
      fpm.publish('#socket/online', message);
    });
    
	});