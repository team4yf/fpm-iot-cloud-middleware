const _ = require('lodash');
const { decoder } = require('./kit.js');

const createTcp = fpm => {

  ///*
  if(fpm.isPluginInstalled('fpm-plugin-socket')){
    // use the fpm-plugin-socket
    const plugin = fpm.getPlugins()['fpm-plugin-socket'];
    if(plugin){
      // get the socket server
      const socketServer = plugin.package.getServer();

      // set decode function
      socketServer.setDataDecoder((src) => {
        const message = decoder(src)
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
    message = message.data || message
    const { uid, pid, sid } = message.header;
    topic = `$d2s/u${uid}/p${pid}/tcp`;
    const { payload } = message;
    fpm.logger.info(topic, { sid, payload })
    fpm.execute('mqtt.publish', { topic, payload: payload.toString('hex') })

  })

  fpm.subscribe('$s2d/tcp/push', (topic, message) => {
    message = decoder(message)
    const { sid } = message.header;
    const { payload } = message;
    fpm.execute('socket.send', {id: sid, message: payload.toString('hex')})
  })
  
  fpm.subscribe('#socket/close', (topic, message) => {
    console.info('#socket/close', message)
  })
};

exports.createTcp = createTcp;