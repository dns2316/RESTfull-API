const winston = require('winston');

const winstonColors = {
  debug: "cyan"
}
winston.addColors(winstonColors);

function getLogger(module) {
  //отобразим метку с именем файла, который выводит сообщение
  const path = module.filename.split('/').slice(-2).join('/');

  return new winston.Logger({
      transports : [
          new winston.transports.Console({
              colorize: true,
              level: 'debug',
              label: path
          })
      ]
  })
}

module.exports = getLogger;
