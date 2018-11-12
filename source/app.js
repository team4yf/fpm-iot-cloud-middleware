'use strict';
const { Fpm } = require('yf-fpm-server');

const { createTcp } = require('./tcp.js');

const { createNB } = require('./nb');

/* The Start: Create Fpm Server */
const fpmServer = new Fpm();

const biz = fpmServer.createBiz('0.0.1');

fpmServer.addBizModules(biz);

fpmServer.run()
	.then(fpm => {
    createTcp(fpm);
    createNB(fpm);
    fpm.execute('mqttclient.subscribe', { topic: ['$s2d/tcp/push', '$s2d/nb/youren/push', '$d2s/offline/tcp']});

    // const handler = (topic, message) =>{
    //   switch(topic){
    //     case '$s2d/tcp/push':
    //     case '$s2d/nb/youren/push':
    //       fpm.publish(topic, message);
    //       return;
    //     case '$d2s/offline/tcp':
    //       fpm.publish('#socket/offline', message);
    //       return;
    //   }
    // };

    fpm.subscribe('$d2s/offline/tcp', (topic, message) =>{
      fpm.publish('#socket/offline', message);
    });
    
	});