const passport = require('passport');
const Strategy = require('passport-http').BasicStrategy;
const UserModel = require('./models/user');
const UserModelVk = require('./models/vkUsers');
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

passport.use(new VKontakteStrategy({
    clientID: VK_APP_ID,
    clientSecret: VK_APP_SECRET,
    callbackURL:  "http://localhost:1437/auth/vk/callback",
    scope: ['email', 'friends'],
    profileFields: ['email', 'friends']
  },
  function(accessToken, refreshToken, params, profile, done) {
    UserModelVk.findOne({vkontakteId: profile.id}, function(err, user){
      if(err){ return done(err) }
      if(!user){
        const user = new UserModelVk({
          vkontakteId: profile.id,
          name: profile.displayName,
          gender: profile.gender,
          photo: profile.photos[0].value,
          email: params.email,
          friends: params.friends,
          info: profile._json
        })
        user.save(function(err) {
          if (err) console.log(err);
          log.info('Was add user from vk: %s. id user: %s', user.name, user.vkontakteId)
          return done(err, user);
        });
      } else {
        return done(err, user);
      }
    })
  }
))

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
