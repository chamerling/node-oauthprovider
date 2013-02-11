/**
 *
 * Copyright(c) 2013 Christophe Hamerling <christophe.hamerling@gmail.com>
 * MIT Licensed
 */
 
var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , fs = require('fs')  
  
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , authMiddleware = require('./config/middlewares/authorization')
  , mongoose = require('mongoose')
  
mongoose.connect(config.db, function(err) {
  // if err...
  console.log('Connected to database!')
});

var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
});

require('./config/passport')(passport, config)

var app = express();
require('./config/express')(app, config, passport)

// Bootstrap routes
require('./config/routes')(app, passport, authMiddleware)

var port = process.env.PORT || config.app.port
app.listen(port, function() {
  console.log('OAuthProvider started on port', port)  
})
