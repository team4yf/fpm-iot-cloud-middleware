/**
 * 华为云的 NB 协议
 */
const _ = require('lodash');
const debug = require('debug')('fpm-iot-cloud-middleware:yiyuan');

const createNB4Tianyi = fpm => {
  fpm.subscribe(`#tianyi/notify`, (topic, message) => {
    try {
      debug('%o, %O', topic, message);
      const { deviceId, service, services } = message;

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
  })

  fpm.subscribe(`$s2d/nb/yiyuan/push`, (topic, message) => {
    if(!message) return;
    const { deviceId, command } = message;
    fpm.execute('tianyi.send', 
      { 
        deviceId: deviceId,
        command
      })
      .catch( error => {
        debug('ERROR: %O', error)
      });
  })

}

exports.createNB4Tianyi = createNB4Tianyi;