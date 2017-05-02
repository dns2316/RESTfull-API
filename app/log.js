const winston = require('winston');
          winstonToMongo = require('winston-mongodb').MongoDB,
          moment = require('moment'),
          config = require('../config');

const winstonColors = {
  debug: "cyan"
}

winston.addColors(winstonColors);

function getLogger(module) {
  // отобразим метку с именем файла, который выводит сообщение
  const path = module.filename.split('/').slice(-2).join('/');

  return new winston.Logger({
      transports : [
          new winston.transports.Console({
              colorize: true, // work without formatter or need config in formatter
              timestamp: function() {
                return moment().format("DD-MM-YYYY HH:mm:ss.SSS");
              },
              level: 'debug',
              label: path,
              formatter: function(options) {
                return '[TIMESTAMP:' + options.timestamp() +'] [LEVEL:'+ options.level.toUpperCase() +']'+ (undefined !== options.message ? " [MESSAGE:"+options.message+"]" : '') +
                    (options.meta && Object.keys(options.meta).length ? ' [META:'+ JSON.stringify(options.meta) +']' : '' );
              }
          }),
          new winstonToMongo({
              db : config.get('mongoose:uri'),
              collection: 'logs'
          })
      ]
  })
}

module.exports = getLogger;
