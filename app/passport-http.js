const passport = require('passport');
const Strategy = require('passport-http').BasicStrategy;
const UserModel = require('./models/user');
const mongoose = require('mongoose');
const VKontakteStrategy = require('passport-vkontakte').Strategy;

const VK_APP_ID = process.env.VK_APP_ID;
const VK_APP_SECRET = process.env.VK_APP_SECRET;

if (!VK_APP_ID || !VK_APP_SECRET) {
    throw new Error('Set VK_APP_ID and VK_APP_SECRET env vars to run the app');
}

passport.use(new Strategy(
  function(username, password, done){
    UserModel.findOne({username: username}, function(err, user){
      if(err){ return done(err) }
      if(!user){ return done(null, false, { message: 'Incorrect username or password.' }) }
      if(user.password != password){ return done(null, false, { message: 'Incorrect username or password.' }) }
      return done(null, user)
    })
  }
))

passport.use(new VKontakteStrategy(
  {
    clientID: VK_APP_ID, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
    clientSecret: VK_APP_SECRET,
    callbackURL:  "http://localhost:3000/auth/vkontakte/callback",
    scope: ['email'],
    profileFields: ['email']
  },
  function verifyCallback(accessToken, refreshToken, params, profile, done) {

    // Now that we have user's `profile` as seen by VK, we can
    // use it to find corresponding database records on our side.
    // Also we have user's `params` that contains email address (if set in
    // scope), token lifetime, etc.
    // Here, we have a hypothetical `User` class which does what it says.
    User.findOrCreate({ vkontakteId: profile.id })
        .then(function (user) { done(null, user); })
        .catch(done);
  }
))

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
