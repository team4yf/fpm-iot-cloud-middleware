/**
 * for the webhook notify
 */

const _ = require('lodash');
const debug = require('debug')('fpm-iot-cloud-middleware:webhook');
const { decoder } = require('./kit.js');

const createWebhook = fpm => {
  fpm.subscribe(`#webhook/tianyi/notify`, (topic, message) => {
    try {
      debug('%o, %O', topic, message);
      const { deviceId, service } = message;
      debug('typeof: %s, data: %s', typeof(service.data.Data), Buffer.from(service.data.Data).toString('hex') );
      fpm.execute('mqttclient.publish', {
        topic: `$d2s/u13/p0/tianyi`,
        payload: { deviceId, data: service.data },
      })
      .catch(error => {
        debug('ERROR: %O', error)
      })  
    } catch (error) {
      debug('syntx ERROR: %O:', error)
    }
    
    // fpm.publish('#tianyi/notify', message);
  })
}

exports.createWebhook = createWebhook;