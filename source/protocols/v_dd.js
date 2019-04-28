/**
 * The protocol dd
 * 主要应对 智能监控箱为主 的物联网运维项目
 */
const _ = require('lodash');
const assert = require('assert');
const debug = require('debug')('fpm-iot-cloud-middleware:v_dd.js')

exports.concatHeader = ( header, payload ) => {
  const headerBuf = Buffer.allocUnsafe(3);
  const sidBuf = Buffer.from(header.sid, 'hex');
  headerBuf.writeUInt8(header.fn)
  headerBuf.writeUInt16BE(header.extra, 1);
  payload = Buffer.concat([sidBuf, headerBuf, payload])
  debug('concatHeader %O', payload);
  return payload;
}
