const express = require('express'),
          passport = require('passport'),
          router = express.Router();

/* GET users listing. */
router.get('/', passport.authenticate('basic', { session: false }), function (req, res) {
    res.json({
    	msg: 'API is running'
    });
});

module.exports = router;
