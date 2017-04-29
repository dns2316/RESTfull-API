const express = require('express')
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();

const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/test');
mongoose.Promise = require('bluebird');

const Article = require('./app/models/article');

// middleware to use for all requests. Лог когда делается запрос
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening in this app');
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/articles')

    // create a article (accessed at POST http://localhost:8080/api/articles)
    .post(function(req, res) {
        console.log(req.body.title)
        let sendArticle = new Article({ // create a new instance of the Article model
          title: req.body.title  // set the articles name (comes from the request
        });

        // save the article and check for errors
        sendArticle.save(function(err) {
            if (err){
              res.send(err);
            } else {
              res.json({ message: 'Article created!' });
            }
        });

    })

    .get(function(req, res) {
      Article.find(function(err, articles) {
        if(err)
          res.send(err);

        res.json(articles);
      })
    })

app.use('/api', router);

app.get('/', function (req, res) {
  res.send('Hello World!<br> This need will be put react app!!!')
})

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!')
})
