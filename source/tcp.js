const _ = require('lodash');
const { decoder, encoder } = require('./protocols');
const debug = require('debug')('fpm-iot-cloud-middleware:tcp');

const createTcp = fpm => {

  let socketServer
  ///*
  if(fpm.isPluginInstalled('fpm-plugin-socket')){
    // use the fpm-plugin-socket
    const plugin = fpm.getPlugins()['fpm-plugin-socket'];
    if(plugin){
      // get the socket server
      socketServer = plugin.package.getServer();

      // set decode function
      socketServer.setDataDecoder((src) => {
        const message = decoder(src)
        if(message === undefined){
          // decode error
          return ;
        }
        const { sid } = message.header;
        return { id: sid, data: message };
      });
      // set encode function
      socketServer.setDataEncoder( src => {
        if(Buffer.isBuffer(src)){
          return src;
        }
        return Buffer.from(src, 'hex');
      });
    }
  }
  //*/
  
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
    message = decoder(message)
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
    message = decoder(message);
    if( message === undefined ){
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