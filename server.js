const express = require('express'),
          app = express(),
          mongoose = require('mongoose'),
          bodyParser = require('body-parser'),
          router = express.Router(),
          config = require('./config'),
          passport = require('passport'),
          cookieParser = require('cookie-parser'),
          log = require('./app/log')(module),
          checkEmpyInArray = require('./app/deleteEmptyInArray');
require('./app/passport-http');

const articlesRoute = require('./routes/articles'),
          QuestionAndAnswerRoute = require('./routes/qaa'),
          registerRoute = require('./routes/register'),
          logoutRoute = require('./routes/logout'),
          loginRoute = require('./routes/login'),
          api = require('./routes/api');

mongoose.connect(config.get('mongoose:uri'));
mongoose.Promise = require('bluebird');

const db = mongoose.connection;
db.on('error', function (err) {
    log.error('Data base connection error: ' + err.message);
});
db.once('open', function callback () {
    log.info("Connected to data base!");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cookieParser());
app.set('port', process.env.PORT || config.get('port') || 3000);

app.get('/',
  function(req, res){
    res.send('hello!')
  }
);
app.get('/auth/vk',
  passport.authenticate('vkontakte'),
  function(req, res){
});

app.get('/auth/vk/callback',
  passport.authenticate('vkontakte', { failureRedirect: '/auth/vk' }),
  function(req, res) {
    res.redirect('/');
});

app.use('/api', api);
app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/register', registerRoute);
app.use('/api/articles', articlesRoute);
app.use('/api/qaa', QuestionAndAnswerRoute);

app.use(function(req, res, next){
    const ipLogger = '| ip: ' +req.ip + ' | ips: ' + req.ips;
    res.status(404);
    log.debug('Not found URL: %s %s', req.url, ipLogger);
    res.send({ error: 'Not found' });
    return;
}); // error 404
app.use(function(err, req, res, next){
    const ipLogger = '| ip: ' +req.ip + ' | ips: ' + req.ips;
    res.status(err.status || 500);
    log.error('Internal error(%d): %s %s', res.statusCode,err.message, ipLogger);
    res.send({ error: err.message });
    return;
}); // error 500

app.listen(app.get('port'), function() {
  log.info('Express server listening on port %s', app.get('port'));
});
