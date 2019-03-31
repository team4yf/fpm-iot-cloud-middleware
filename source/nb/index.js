const { createNB4Youren } = require('./youren.js');
const { createNB4Tianyi } = require('./yiyuan.js');

exports.createNB = fpm => {
    createNB4Youren(fpm);
    createNB4Tianyi(fpm);
};