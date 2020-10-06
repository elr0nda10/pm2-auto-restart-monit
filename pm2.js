const pm2 = require('pm2');
const Promise = require('bluebird');

const pm2Connect = Promise.promisify(pm2.connect).bind(pm2);
const pm2List = Promise.promisify(pm2.list).bind(pm2);
const pm2Restart = Promise.promisify(pm2.restart).bind(pm2);

module.exports = {
  instance: pm2,
  async connect() {
    return pm2Connect();
  },
  async psList() {
    return pm2List();
  },
  async restart(pm2Id) {
    return pm2Restart(pm2Id);
  }
}
