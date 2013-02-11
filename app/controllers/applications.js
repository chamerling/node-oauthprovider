/**
 *
 * Copyright(c) 2013 Christophe Hamerling <christophe.hamerling@gmail.com>
 * MIT Licensed
 */


var mongoose = require('mongoose')
  , Application = mongoose.model('Application');
  
/**
 * New application. Just put it in the response...
 */
exports.new = function(req, res){
  res.render('applications/new', {
      title: 'New Application'
    , application: new Application({})
  })
}
  
/**
 * Create a new application for the current user 
 */
exports.create = function(req, res) {  
  var application = new Application(req.body);
  application.user = req.user;
  
  application.save(function (err) {
    if (err) {
      return res.render('applications/create', { errors: err.errors, application: application })
    }
    console.log('Application has been created')
    return res.redirect('/applications/' + application._id);
  })  
}

// get the applications created by the current user
exports.list = function(req, res) {
  Application.find({user : req.user.id}, function(err, applications) {
    console.log(applications);
    if (err) {
      return res.render('applications/list', { errors: err.errors, applications: applications })
    }
    return res.render('applications/list', {applications: applications});
  });
}

// get the applications used by the current user
exports.used = function(req, res) {

}

// get the list of users using the given application
exports.users = function(req, res) {
  // application id is in the req...
}

// Show an application
exports.show = function(req, res) {
  res.render('applications/show', {
    application: req.application
  })
}
