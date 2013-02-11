/**
 * User API
 *
 * Copyright(c) 2013 Christophe Hamerling <christophe.hamerling@gmail.com>
 * MIT Licensed
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , passport = require('passport')

exports.signin = function (req, res) {
  
}

exports.authCallback = function (req, res, next) {
  res.redirect('/')
}

exports.me = function (req, res) {
  if (req.user && req.user.id) {
    res.redirect('/users/' + req.user.id)
  } else {
    res.redirect('/login');
  }
}

exports.login = function (req, res) {
  res.render('users/login', {
      title: 'Login'
    , message: req.flash('error')
  })
}

exports.postlogin = passport.authenticate('local', { successReturnToOrRedirect: '/me', failureRedirect: '/login' });

exports.signup = function (req, res) {
  res.render('users/signup', {
      title: 'Sign up'
    , user: new User()
  })
}

exports.logout = function (req, res) {
  req.logout()
  res.redirect('/login')
}

exports.session = function (req, res) {
  res.redirect('/')
}

exports.create = function (req, res) {
  var user = new User(req.body)
  user.save(function (err) {
    if (err) {
      return res.render('users/signup', { errors: err.errors, user: user })
    }
    req.logIn(user, function(err) {
      if (err) return next(err)
      return res.redirect('/')
    })
  })
}

/**
 * 
 */
exports.show = function (req, res) {
  var user = req.profile
  res.render('users/show', {
      title: user.name
    , user: user
  })
}
