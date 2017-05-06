const User = require('../app/models/user'),
log = require('../app/log')(module),
express = require('express'),
router = express.Router();

require('passport');

router.post('/', function(req, res){
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });
  user.save(function(err) {
    return err
      ? log.error(err)
      : req.logIn(user, function(err) {
        return err
          ? log.error(err)
          : res.redirect('/private');
      });
  });
});
module.exports = router;
