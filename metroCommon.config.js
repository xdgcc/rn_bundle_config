const config = require('./metro.multi.config.js')

module.exports = {

  serializer: {
    createModuleIdFactory: config.createModuleIdFactory,
    /* serializer options */
  }
};
