/**
 *
 * Copyright(c) 2013 Christophe Hamerling <christophe.hamerling@gmail.com>
 * MIT Licensed
 */

var mongoose = require('mongoose')
  , LocalStrategy = require('passport-local').Strategy
  , BasicStrategy = require('passport-http').BasicStrategy
  , ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy
  , BearerStrategy = require('passport-http-bearer').Strategy
  , Application = mongoose.model('Application')
  , User = mongoose.model('User')
  , AccessToken = mongoose.model('AccessToken')
  

module.exports = function (passport, config) {
  
  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, function (err, user) {
      done(err, user)
    })
  })

  // use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      console.log('Authenticating user from email', email);
      
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          return done(err)
        }
                
        if (!user) {
          return done(null, false, { message: 'Unknown user' })
        }
        
        if (!user.authenticate(password)) {
          console.log('!AUTH')
          return done(null, false, { message: 'Invalid password' })
        }
        
        return done(null, user)
      })
    }
  ))
  
  passport.use(new BasicStrategy(
    function(username, password, done) { 
      // TODO : A quoi ca sert???? ClientId et username sont mixés!
      console.log('BasicStrategy TODO', username + password)
      return done(new Error('Not implemented'));
      /*
      db.clients.findByClientId(username, function(err, client) {
        if (err) { return done(err); }
        if (!client) { return done(null, false); }
        if (client.clientSecret != password) { return done(null, false); }
        return done(null, client);
      });
      */
    }
  ));
  
  passport.use(new ClientPasswordStrategy(
    function(clientId, clientSecret, done) {
    
      Application.findOne({clientID : clientId, clientSecret : clientSecret}, function(err, client) {
        if (err) { return done(err); }
        if (!client) { return done(null, false); }
        return done(null, client);
      });
    }
  ));
  
  /**
   * BearerStrategy
   *
   * This strategy is used to authenticate users based on an access token (aka a
   * bearer token).  The user must have previously authorized a client
   * application, which is issued an access token to make requests on behalf of
   * the authorizing user.
   */
  passport.use(new BearerStrategy(
    function(accessToken, done) {
      console.log('BEARER', accessToken)
      AccessToken.findOne({token : accessToken}, function(err, token) {
        if (err) { return done(err); }
        if (!token) { return done(null, false); }
              
        User.findOne({_id : token.user}, function(err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          // to keep this example simple, restricted scopes are not implemented,
          // and this is just for illustrative purposes
          var info = { scope: '*' }
          done(null, user, info);
        });
      });
    }
  ));
}