const User = require('../app/models/user'),
log = require('../app/log')(module),
express = require('express'),
passport = require('passport'),
router = express.Router();


router.post('/', function(req, res){
  passport.authenticate('basic',
    function(err, user) {
      return err
        ? log.error(err)
        : user
          ? req.logIn(user, function(err) {
              return err
                ? log.error(err)
                : res.redirect('/');
            })
          : res.redirect('/login');
    }
  )(req, res);
});

module.exports = router;
