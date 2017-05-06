const express = require('express'),
router = express.Router();

router.post('/', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
