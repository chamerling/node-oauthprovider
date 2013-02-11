/**
 *
 * Copyright(c) 2013 Christophe Hamerling <christophe.hamerling@gmail.com>
 * MIT Licensed
 */
 
var mongoose = require('mongoose')
  , Application = mongoose.model('Application')
  , User = mongoose.model('User')
  , async = require('async');

module.exports = function (app, passport, auth) {
  
  // create user routes
  var users = require('../app/controllers/users');
  app.get('/login',  users.login);
  app.get('/me',     users.me);
  app.post('/login', users.postlogin);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);  
  app.get('/users/:userId', users.show);
  app.param('userId', function (req, res, next, id) {
    User
      .findOne({ _id : id })
      .exec(function (err, user) {
        if (err) return next(err)
        if (!user) return next(new Error('Failed to load User ' + id))
        req.profile = user
        next()
      })
  });
  
  // create application routes
  var applications = require('../app/controllers/applications');
  app.get('/applications/new', auth.requiresLogin, applications.new);
  app.get('/applications/:appId', auth.requiresLogin, auth.application.hasAuthorization, applications.show)
  app.post('/applications/create', auth.requiresLogin, applications.create);
  app.get('/applications', auth.requiresLogin, applications.list);
  app.get('/applications/used', auth.requiresLogin, applications.used);
  
  //app.get('/applications/users', applications.users);
  
  app.param('appId', function (req, res, next, id) {
    Application
      .findOne({ _id : id })
      .exec(function (err, application) {
        if (err) return next(err)
        if (!application) return next(new Error('Failed to load Application ' + id))
        req.application = application
        next()
      })
  });
  
  // api
  // TODO : Separate routes...
  var userapi = require('../app/api/user');
  app.get('/api/userinfo', userapi.info);
  
  // oauth2
  var oauth2 = require('./oauth2');
  app.get('/dialog/authorize', oauth2.authorization);
  app.post('/dialog/authorize/decision', oauth2.decision);
  app.post('/oauth/token', oauth2.token);
  
  
  // defaults
  app.get('/', function(req, res) {
    res.redirect('/me')
  });
}