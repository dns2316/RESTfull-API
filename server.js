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

router.route('/articles/:articles_id')
  // get a article by articles_id (accessed at POST http://localhost:8080/api/articles/:id)
  .get(function(req, res) {
    Article.findById(req.params.articles_id, function(err, article) {
      if(err) {
        res.send(err);
      } else {
        res.json(article);
      }
    })
  })
  // update a article by articles_id (accessed at POST http://localhost:8080/api/articles/:id)
  .put(function(req, res) {
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
        article.hidden = req.body.hidden ? req.body.hidden : article.hidden
      }

        // save updated article and check for errors
        article.save(function(err) {
            if(err) {
              res.send(err);
            } else {
              res.json({ message: 'Article updated!' });
            }
        });
    })
  })
  //delete the article with this id
  .delete(function(req, res) {
    Article.remove({
      _id: req.params.articles_id
    }, function(err, article){
      err? res.send(err):
      res.json({ message: 'Successfully deleted article' })
    })
  })
  // posts by id

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
  // update a qaa by qaa_id (accessed at POST http://localhost:8080/api/qaa/:id)
  .put(function(req, res) {
    QuestionAndAnswer.findById(req.params.qaa_id, function(err, qaa) {
      if(err) {
        res.send(err);
      } else {
        qaa.answer = req.body.answer ? req.body.answer : qaa.answer,
        qaa.answer.modified = Date.now(),
        qaa.hidden = req.body.hidden ? req.body.comments : qaa.comments
      }

        // save updated article and check for errors
        qaa.save(function(err) {
            if(err) {
              res.send(err);
            } else {
              res.json({ message: 'QuestionAndAnswer updated!' });
            }
        });
    })
  })
  //delete the article with this id
  .delete(function(req, res) {
    QuestionAndAnswer.remove({
      _id: req.params.qaa_id
    }, function(err, article){
      err? res.send(err):
      res.json({ message: 'Successfully deleted QuestionAndAnswer' })
    })
  })
  // QuestionAndAnswer by id

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
