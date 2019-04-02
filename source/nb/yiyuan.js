/**
 * 华为云的 NB 协议
 */
const _ = require('lodash');
const debug = require('debug')('fpm-iot-cloud-middleware:yiyuan');
const { decode, encode } = require('../protocols/tianyi');

const createNB4Tianyi = fpm => {
  fpm.subscribe(`#tianyi/notify`, (topic, message) => {
    try {
      debug('%o, %O', topic, message);
      const { header, payload } = decode(message);
      debug('Decoded message, Header:%O, Payload: %O', header, payload)
      const { uid, pid } = header;
      fpm.execute('mqttclient.publish', {
        topic: `$d2s/u${uid}/p${pid}/tianyi`,
        payload: JSON.stringify({ header, payload }),
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
    try {
      const { deviceId, params } = encode(message);
      debug('%o, %O', deviceId, params);
      fpm.execute('tianyi.send', 
        { 
          deviceId,
          command: {
            serviceId: 'Cmd',
            method: 'Set_Cmd',
            paras: params
          }
        })
        .catch( error => {
          debug('ERROR: %O', error)
        });
    } catch (error) {
      debug('syntx ERROR: %O:', error)
    }
    
  })

}

exports.createNB4Tianyi = createNB4Tianyi;