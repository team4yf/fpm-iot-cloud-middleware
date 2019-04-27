/**
 * 用于处理 TCP 数据交互的逻辑
 * 1. 获取fpm-plugin-socket插件来创建一个服务端
 * 2. 绑定数据解析函数
 * 3. 中间件接受到TCP数据之后，会调用解析函数，并将解析后的数据通过 MQTT 发送一包主题为 `$d2s/u?/p?/tcp` 的数据
 *    提供给应用订阅消费。
 * 4. 中间件订阅主题为 `$s2d/tcp/push` 的 MQTT 事件，将应用数据通过 TCP 推送给设备
 * 5. 
 */

const _ = require('lodash');
const assert = require('assert');

const { decoder } = require('../protocols');
const debug = require('debug')('fpm-iot-cloud-middleware:tcp');

const createTcp = fpm => {

  let socketServer;
  try {
    assert(fpm.isPluginInstalled('fpm-plugin-socket'), 'fpm-plugin-socket required');
    const plugin = fpm.getPlugins()['fpm-plugin-socket'];
    assert(!!plugin, 'get socket plugin handler error!');
    socketServer = plugin.package.getServer();
    assert(!!socketServer, 'get socketServer handler error!');

  } catch (error) {
    debug('CreateTcp Error: %O', error);
    fpm.logger.error(error);
  }

  socketServer.setDataDecoder((src) => {
    try {
      const message = decoder(src)
      const { sid } = message.header;
      return { id: sid, data: message };
    } catch (error) {
      debug('decode socket data Error: %O', error);
      fpm.logger.error(error);
      return;
    }
  });

  // set encode function
  socketServer.setDataEncoder( src => {
    if(Buffer.isBuffer(src)){
      return src;
    }
    return Buffer.from(src, 'hex');
  });

  fpm.subscribe('#socket/receive', (topic, message) => {
    debug('#socket/receive: %O', message);
    message = message.data || message
    const { uid, pid, sid } = message.header;
    topic = `$d2s/u${uid}/p${pid}/tcp`;
    message.header.network = 'tcp';
    const payload = JSON.stringify(message);
    debug('mqttclient.publish: %O', { topic, payload });
    fpm.execute('mqttclient.publish', { topic, payload })
      .catch( error => fpm.logger.error('#socket/receive => mqttclient.publish', { topic, payload }, error));
  })

  fpm.subscribe('$s2d/tcp/push', (topic, message) => {
    try {
      message = decoder(message)
    } catch (error) {
      debug('decode $s2d/tcp/push socket data Error: %O', error);
      fpm.logger.error(error);
      return;
    }

    debug('$s2d/tcp/push: %O', message);
    const { sid } = message.header;
    const { payload } = message;
    debug('socket.send: %O', {id: sid, message: payload.toString('hex')});
    fpm.execute('socket.send', {id: sid, message: payload.toString('hex')})
      .catch( error => fpm.logger.error('$s2d/tcp/push => socket.send', {id: sid, message: payload.toString('hex')}, error));
  })

  fpm.subscribe('$s2d/tcp/broadcast', (topic, message) => {
    debug('$s2d/tcp/broadcast: %s', message.toString());
    fpm.execute('socket.broadcast', JSON.parse(message.toString()))
      .catch( error => fpm.logger.error('$s2d/tcp/broadcast => socket.broadcast', data, error));
  })

  fpm.subscribe('$s2d/tcp/addChannel', (topic, message) => {
    debug('$s2d/tcp/addChannel: %s', message.toString());
    fpm.execute('socket.addChannel', JSON.parse(message.toString()))
      .catch( error => fpm.logger.error('$s2d/tcp/addChannel => socket.addChannel', data, error));
  })

  fpm.subscribe('#socket/offline', (topic, message) => {
    try {
      message = decoder(message)
    } catch (error) {
      debug('decode $s2d/offline socket data Error: %O', error);
      fpm.logger.error(error);
      return;
    }
    debug('#socket/offline: %O', message);
    const { sid } = message.header;
    if(socketServer){
      socketServer.deviceOffline(socketServer.createClient(sid))
    }
  })

  fpm.subscribe('#socket/close', (topic, message) => {
    debug('#socket/close: %O', message);
    fpm.logger.error('#socket/close', message)
  })
};

exports.createTcp = createTcp;