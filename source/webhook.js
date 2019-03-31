/**
 * for the webhook notify
 */

const _ = require('lodash');
const debug = require('debug')('fpm-iot-cloud-middleware:webhook');
const { decoder } = require('./kit.js');

const createWebhook = fpm => {
  fpm.subscribe(`#webhook/tianyi/notify`, (topic, message) => {
    // console.log(topic, message);
    debug('%o, %O', topic, message);
    const { deviceId, services } = message;
    debug('typeof: %s, data: %s', typeof(services.data), services.data );
    fpm.execute('mqtt.publish', {
      topic: `$d2s/u13/p0/tianyi`,
      payload: { deviceId, data: services.data },
    })
    .catch(error => {
      debug('ERROR: %O', error)
    })
    // fpm.publish('#tianyi/notify', message);
  })
}

exports.createWebhook = createWebhook;