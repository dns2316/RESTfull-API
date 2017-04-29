const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();
const log = require('./app/log')(module);

const port = process.env.PORT || 8080;

mongoose.connect('mongodb://localhost:27017/test');
mongoose.Promise = require('bluebird');

const Article = require('./app/models/article');
const QuestionAndAnswer = require('./app/models/questionAndAnswer');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/', function(req, res) {
    res.json({ message: 'Welcome to API!' });
});

router.route('/articles')
  // create a article (accessed at POST http://localhost:8080/api/articles)
  .post(function(req, res) {
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

router.route('/qaa')
  // create a QuestionAndAnswer (accessed at POST http://localhost:8080/api/qaa)
  .post(function(req, res) {
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

app.use('/api', router);

app.get('/', function (req, res) {
  res.send('Hello World!<br> This need will be put react app!!!<br> Or run react separately')
})

app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
}); // error 404
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
}); // error 500


app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!')
})
