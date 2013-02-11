/**
 *
 * Copyright(c) 2013 Christophe Hamerling <christophe.hamerling@gmail.com>
 * MIT Licensed
 */
 
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , BasicStrategy = require('passport-http').BasicStrategy
  , ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy
  , BearerStrategy = require('passport-http-bearer').Strategy
  , mongoose = require('mongoose')

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(new LocalStrategy(
  function(username, password, done) {
    
    User.findOne({username : username}, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password != password) { return done(null, false); }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({_id : id}, function (err, user) {
    done(err, user);
  });
});


/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients.  They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens.  The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate.  Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header).  While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
passport.use(new BasicStrategy(
  function(username, password, done) { 
    // TODO : A quoi ca sert???? ClientId et username sont mixés!
    console.log('BasicStrategy')
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
    
    // TODO  : We can directly find one with clientID and clientSecret...
    
    Client.findOne({clientID : clientId}, function(err, client) {
      if (err) { return done(err); }
      if (!client) { return done(null, false); }
      if (client.clientSecret != clientSecret) { return done(null, false); }
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
    console.log('Bearer Strategy with access_token=', accessToken)
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