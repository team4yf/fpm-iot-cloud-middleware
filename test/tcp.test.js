const assert = require('assert');
const net = require('net');
const _ = require('lodash');

// mqtt client
const mqtt = require('mqtt');
const config = require('../config.default.json').mqttserver;
const { host, port } = config;

const mqttClient = mqtt.connect(`mqtt://${host}:${port}`, config);

// socket client
const LOCAL_HOST = 'localhost';

const PORT = 5001;

const ID = _.now();

let client;

const debug = require('debug')('TEST')

String.prototype.trim = function(){
  return this.replace(/\s/g, '');
}
const data = "11 00 00 03 00 00 00 03 ff fe fd fc 05 00 00 01 00 00 53 92".trim();

describe('TCP Protocol Test', function(){

  before( async () => {
    try {
      await new Promise( (rs, rj) => {
        mqttClient.subscribe(['$d2s/u3/p3/tcp'], () => {
          rs();
        });
      })

      await new Promise( (rs, rj) => {
        client = net.createConnection({ host: LOCAL_HOST, port: PORT, timeout: 9 * 1000 }, () => {
          rs();
        })
      })
    } catch (error) {
      throw error;
    }
  });
  after(function(done){
    client.end();
    mqttClient.end();
    done();

  })

  it('Run tcp, Send 11 00 00 03 00 00 00 03 ff fe fd fc 05 00 00 01 00 00 53 92', function(done){
    this.timeout(10 * 1000)
    mqttClient.on('message', (topic, payload) => {
      debug('on data %s, %s', topic, payload)
      const message = JSON.parse(payload);
      assert(message.header.vid === 17, 'vid should be 0x11');
      done();
    })
    client.write(Buffer.from(data, 'hex'), () => {
      debug('write ok')
    });
  })

})