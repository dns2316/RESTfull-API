const express = require('express'),
          router = express.Router(),
          passport = require('passport'),
          checkEmpyInArray = require('../app/deleteEmptyInArray');
          log = require('../app/log')(module);

const Article = require('../app/models/article');

router.post('/', passport.authenticate('basic', { session: false }),
  function(req, res){
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
}); // add article

router.get('/', function(req, res){
    Article.find(function(err, articles) {
      if(err) {
        res.send(err);
      } else {
        res.json(articles);
      }
    })
}); // read articles

router.get('/:articles_id', passport.authenticate('basic', { session: false }),
  function(req, res){
      Article.findById(req.params.articles_id, function(err, article) {
        if(err) {
          res.send(err);
        } else {
          res.json(article);
        }
      })
}); // get a article by articles_id

router.put('/:articles_id', passport.authenticate('basic', { session: false }),
  function(req, res){
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
    }); // update article with id

router.delete('/:articles_id', passport.authenticate('basic', { session: false }),
  function(req, res){
    const ipLogger = '| ip: ' +req.ip + ' | ips: ' + req.ips;
    Article.remove({
      _id: req.params.articles_id
    }, function(err, article){
      err? res.send(err):
      log.info('Delete article: %s %s', article.title, ipLogger)
      res.json({ message: 'Successfully deleted article' })
    })
  }); // delete article by id

module.exports = router;
