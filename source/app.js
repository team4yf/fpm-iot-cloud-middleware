'use strict';
const { Fpm } = require('yf-fpm-server');
const assert = require('assert');
const debug = require('debug')('fpm-iot-cloud-middleware:app');
const _ = require('lodash');
const { createTcp } = require('./tcp');
const { createNB } = require('./nb');

/* The Start: Create Fpm Server */
const fpmServer = new Fpm();

const biz = fpmServer.createBiz('0.0.1');

fpmServer.addBizModules(biz);

fpmServer.run()
	.then(fpm => {
    createTcp(fpm);
    createNB(fpm);
    fpm.execute('mqttclient.subscribe',
      { topic: [
        '$s2d/tcp/push',
        '$s2d/tcp/broadcast',
        '$s2d/tcp/addChannel',
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

    const notifyList = fpm.getConfig('notify', []);
    if(!_.isEmpty(notifyList)){
      const router = fpm.createRouter();
      _.forEach(notifyList, one => {
        router.post(`/notify/${one.url}`, async ctx => {
          try {
            const body = ctx.request.body;
            debug(body);
            fpm.execute('mqttclient.publish', { topic: one.topic, payload: JSON.stringify(_.assign({ header: one.header, body }))} )
              .catch( fpm.logger.error);
            debug({ topic: one.topic, payload: _.assign({ header: one.header, body })});
            ctx.body = one.response;
          } catch (error) {
            fpm.logger.error(`/notify/${one.url}`, error);
            ctx.body = {
              errno: -999,
              message: error.message,
              error: error
            }
          }
        })
      })
      fpm.bindRouter(router);
    }
	});