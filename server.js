const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();
const config = require('./config');
const oauth2 = require('./app/oauth2');
const passport = require('passport');
const _ = require('lodash');
const log = require('./app/log')(module);
const checkEmpyInArray = require('./app/deleteEmptyInArray');
require('./app/oauth');

mongoose.connect(config.get('mongoose:uri'));
mongoose.Promise = require('bluebird');

const db = mongoose.connection;
db.on('error', function (err) {
    log.error('Data base connection error: ' + err.message);
});
db.once('open', function callback () {
    log.info("Connected to data base!");
});

const Article = require('./app/models/article');
const QuestionAndAnswer = require('./app/models/questionAndAnswer');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());

router.get('/', function(req, res) {
    res.json({ message: 'Welcome to API!' });
});

router.route('/articles')
  // create a article (accessed at POST http://localhost:8080/api/articles)
  .post(function(req, res) {
      const ipLogger = '| ip: ' +req.ip + ' | ips: ' + req.ips;
      let sendArticle = new Article({ // create a new instance of the Article model
        title: req.body.title,
        author: req.body.author,
        body: req.body.body,
        images: req.body.images,
        comments: req.body.comments,
        hidden: req.body.hidden
      });

      // save the article and check for errors
      sendArticle.save(function(err) {
          if(err) {
            res.send(err);
          } else {
            log.info('Create article: %s %s', sendArticle.title, ipLogger)
            res.json({ message: 'Article created!' });
          }
      });
  })

  .get(function(req, res) {
    Article.find(function(err, articles) {
      if(err) {
        res.send(err);
      } else {
        res.json(articles);
      }
    })
  }); // posts

router.route('/articles/:articles_id')
  // get a article by articles_id (accessed at GET http://localhost:8080/api/articles/:id)
  .get(function(req, res) {
    Article.findById(req.params.articles_id, function(err, article) {
      if(err) {
        res.send(err);
      } else {
        res.json(article);
      }
    })
  })
  // update a article by articles_id (accessed at PUT http://localhost:8080/api/articles/:id)
  .put(function(req, res) {
    const ipLogger = '| ip: ' +req.ip + ' | ips: ' + req.ips;
    let updateToLogger = []; // mb will edit (push to different columns or array)
    Article.findById(req.params.articles_id, function(err, article) {
      if(err) {
        res.send(err);
      } else {
        article.title = req.body.title ? req.body.title : article.title,
        article.author = req.body.author ? req.body.author : article.author,
        article.body = req.body.body ? req.body.body : article.body,
        article.images = req.body.images ? req.body.images : article.images,
        article.comments = req.body.comments ? req.body.comments : article.comments,
        article.modified = Date.now(),
        article.hidden = req.body.hidden ? req.body.hidden : article.hidden,
        updateToLogger.push(req.body.title, req.body.author, req.body.body, req.body.comments, req.body.hidden);
        updateToLogger = checkEmpyInArray(updateToLogger);
      }

        // save updated article and check for errors
        article.save(function(err) {
            if(err) {
              res.send(err);
            } else {
              log.info('Update article: %s %s', updateToLogger, ipLogger)
              res.json({ message: 'Article updated!' });
            }
        });
    })
  })
  //delete the article with this id
  .delete(function(req, res) {
    const ipLogger = '| ip: ' +req.ip + ' | ips: ' + req.ips;
    Article.remove({
      _id: req.params.articles_id
    }, function(err, article){
      err? res.send(err):
      log.info('Delete article: %s %s', article.title, ipLogger)
      res.json({ message: 'Successfully deleted article' })
    })
  })
  // posts by id

router.route('/qaa')
  // create a QuestionAndAnswer (accessed at POST http://localhost:8080/api/qaa)
  .post(function(req, res) {
      const ipLogger = '| ip: ' +req.ip + ' | ips: ' + req.ips;
      let sendQuestionAndAnswer = new QuestionAndAnswer({ // create a new instance of the QuestionAndAnswer model
        title: req.body.title,
        author: req.body.author,
        body: req.body.body,
        answer: req.body.answer,
        comments: req.body.comments,
        hidden: req.body.hidden
      });

      // save the QuestionAndAnswer and check for errors
      sendQuestionAndAnswer.save(function(err) {
          if(err) {
            res.send(err);
          } else {
            log.info('Create Question: %s %s', sendQuestionAndAnswer.title, ipLogger)
            res.json({ message: 'QuestionAndAnswer created!' });
          }
      });
  })

  .get(function(req, res) {
    QuestionAndAnswer.find(function(err, articles) {
      if(err) {
        res.send(err);
      } else {
        res.json(articles);
      }
    })
  }) // questions and answers

router.route('/qaa/:qaa_id')
  // get a QuestionAndAnswer by qaa_id (accessed at POST http://localhost:8080/api/qaa/:id)
  .get(function(req, res) {
    QuestionAndAnswer.findById(req.params.qaa_id, function(err, qaa) {
      if(err) {
        res.send(err);
      } else {
        res.json(qaa);
      }
    })
  })
  // update a qaa by qaa_id (accessed at PUT http://localhost:8080/api/qaa/:id)
  .put(function(req, res) {
    const ipLogger = '| ip: ' +req.ip + ' | ips: ' + req.ips;
    QuestionAndAnswer.findById(req.params.qaa_id, function(err, qaa) {
      if(err) {
        res.send(err);
      } else {
        qaa.answer = req.body.answer ? req.body.answer : qaa.answer,
        qaa.answer.modified = Date.now(),
        qaa.hidden = req.body.hidden ? req.body.comments : qaa.comments
      }

        // save updated question and check for errors
        qaa.save(function(err) {
            if(err) {
              res.send(err);
            } else {
              log.info('Update question: %s %s', qaa.answer, ipLogger)
              res.json({ message: 'QuestionAndAnswer updated!' });
            }
        });
    })
  })
  //delete the article with this id
  .delete(function(req, res) {
    const ipLogger = '| ip: ' +req.ip + ' | ips: ' + req.ips;
    QuestionAndAnswer.remove({
      _id: req.params.qaa_id
    }, function(err, question){
      err? res.send(err):
      log.info('Delete QuestionAndAnswer: %s %s', question.title, ipLogger)
      res.json({ message: 'Successfully deleted QuestionAndAnswer' })
    })
  })
  // QuestionAndAnswer by id

app.use('/api', router);

app
  .get('/', function (req, res) {
    res.send('Hello World!<br> This need will be put react app!!!<br> Or run react separately')
  })
  .get('/api/userInfo',
    passport.authenticate('bearer', { session: false }),
      function(req, res) {
          // req.authInfo is set using the `info` argument supplied by
          // `BearerStrategy`.  It is typically used to indicate scope of the token,
          // and used in access control checks.  For illustrative purposes, this
          // example simply returns the scope in the response.
          res.json({ user_id: req.user.userId, name: req.user.username, scope: req.authInfo.scope })
      }
  )
  .post('/oauth/token', oauth2.token);

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

// example to add users and client
  // const UserModel = require('./app/models/user');
  // const ClientModel = require('./app/models/client');
  // const AccessTokenModel = require('./app/models/accessToken');
  // const RefreshTokenModel = require('./app/models/refreshToken');
  // const faker = require('faker');
  //
  // UserModel.remove({}, function(err) {
  //     var user = new UserModel({ username: "andrey", password: "simplepassword" });
  //     user.save(function(err, user) {
  //         if(err) return log.error(err);
  //         else log.info("New user - %s:%s",user.username,user.password);
  //     });
  // });
  //
  // ClientModel.remove({}, function(err) {
  //     var client = new ClientModel({ name: "OurService iOS client v1", clientId: "mobileV1", clientSecret:"abc123456" });
  //     client.save(function(err, client) {
  //         if(err) return log.error(err);
  //         else log.info("New client - %s:%s",client.clientId,client.clientSecret);
  //     });
  // });
  // AccessTokenModel.remove({}, function (err) {
  //     if (err) return log.error(err);
  // });
  // RefreshTokenModel.remove({}, function (err) {
  //     if (err) return log.error(err);
  // });
  //
  // setTimeout(function() {
  //     mongoose.disconnect();
  // }, 3000);

app.listen(config.get('port'), function () {
  console.log('App listening on port %s!', config.get('port'))
})
