const express = require('express'),
          oauth2 = require('../app/oauth2'),
          log = require('../app/log')(module),
          router = express.Router();

router.post('/token', oauth2.token);

module.exports = router;
