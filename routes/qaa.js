const express = require('express'),
          router = express.Router(),
          passport = require('passport'),
          log = require('../app/log')(module);

const QuestionAndAnswer = require('../app/models/questionAndAnswer');

router.route('/', passport.authenticate('bearer', { session: false }))
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

router.route('/:qaa_id', passport.authenticate('bearer', { session: false }))
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

module.exports = router;
