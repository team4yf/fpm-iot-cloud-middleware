/**
 * 有人透传云的 nb 协议，使用 mqtt 协议来订阅硬件的消息
 */

const _ = require('lodash');
const { decoder } = require('../kit.js');

const createNB4Youren = fpm => {

  ///*
  if(fpm.isPluginInstalled('fpm-plugin-nbiot')){
      
    const plugin = fpm.getPlugins()['fpm-plugin-nbiot'];
    if(plugin){
        
      const pkg = plugin.package;

      // set decode function
      pkg.setDecoder((src) => {
        return decoder(src)
      });
      // set encode function
      pkg.setEncoder( src => {
        return Buffer.from(src, 'hex');
      });
    }
  }
  //*/
  fpm.subscribe('#nbiot/receive', (topic, data) => {
    if(undefined == data){
      return ;
    }
    // HOW TO Use The NB Code ?
    try{
      let { message, nb } = data;
      if(message == undefined ){
        return ;
      }
      const { uid, pid, sid } = message.header;
      topic = `$d2s/u${uid}/p${pid}/nb`;
      message.header.network = 'nb';
      const payload = JSON.stringify(message)
      // fpm.logger.info({ topic, payload })
      fpm.execute('mqttclient.publish', { topic, payload });
    }catch(e){
     console.error('Exception:', e)
    }
  })

  fpm.subscribe('$s2d/nb/youren/push', (topic, data) => {
    message = decoder(data);
    if(!message) return;
    const { nb } = message.header;
    const { payload } = message;
    // fpm.logger.info('nbiot.send', {id: nb, message: payload.toString('hex')})
    fpm.execute('nbiot.send', {id: nb, message: payload.toString('hex')});
    
  })
};

exports.createNB4Youren = createNB4Youren;