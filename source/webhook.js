/**
 * for the webhook notify
 */

const _ = require('lodash');
const debug = require('debug')('fpm-iot-cloud-middleware:webhook');
const { decoder } = require('./kit.js');

const createWebhook = fpm => {
  fpm.subscribe(`#webhook/tianyi/notify`, (topic, message) => {
    // console.log(topic, message);
    debug('%o, %o', topic, message);
    fpm.execute('mqtt.publish', {
      topic: `$d2s/u13/p0/tianyi`,
      payload: message,
    })
    // fpm.publish('#tianyi/notify', message);
  })
}

exports.createWebhook = createWebhook;