/**
 * 华为云的 NB 协议
 * 设备推送的信息，通过 https post 到我们自己搭建的服务上，
 * 因此，需要订阅一个 #tianyi/notify 事件来初步处理信息，
 * 调用的协议是 tianyi 协议。
 * 该协议说明：Common-tianyi.md
 * 
 * 并通过订阅 $s2d/nb/yiyuan/push 来处理 应用向设备推送的数据
 */
const _ = require('lodash');
const debug = require('debug')('fpm-iot-cloud-middleware:yiyuan');
const { decode, encode } = require('../protocols/tianyi');

const { decoder } = require('../protocols');

const createNB4Tianyi = fpm => {
  // 订阅设备推送给平台的数据
  fpm.subscribe(`#tianyi/notify`, (topic, message) => {
    try {
      debug('%o, %O', topic, message);
      const { header, payload } = decode(message);
      debug('Decoded message, Header:%O, Payload: %O', header, payload)
      // decoder(payload);
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

  // 订阅应用向设备推送的数据
  fpm.subscribe(`$s2d/nb/yiyuan/push`, (topic, message) => {
    if(!message) return;
    try {
      const { deviceId, params } = encode(message);
      debug('%s, %O', deviceId, params);
      fpm.execute('tianyi.send',
        {
          deviceId,
          command: {
            serviceId: 'Payload',
            method: 'Set_cmd',
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
