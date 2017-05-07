const User = require('../app/models/user'),
log = require('../app/log')(module),
express = require('express'),
router = express.Router();

require('passport');

router.post('/', function(req, res, next){
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });
  user.save(function(err) {
    if(err){
      res.json(err);
      return log.error(err)
    } else{
      res.json('Register successful');
      return res.redirect('/')
    }

    // req.logIn(user, function(err) {
    //   if(err){
    //     log.error(err);
    //     res.json(err);
    //   } else {
    //     return res.redirect('/')
    //   }
    // });
  });
});
module.exports = router;
