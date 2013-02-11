/**
 * Applications created by users.
 *
 * Copyright(c) 2013 Christophe Hamerling <christophe.hamerling@gmail.com>
 * MIT Licensed
 */


var mongoose = require('mongoose')
  , utils = require('../../utils')
  , Schema   = mongoose.Schema;

var ApplicationSchema = new Schema({
  name          : String,
  description   : String,
  callbackURL   : String,
  clientID      : String, // generated at creation
  clientSecret  : String, // generated at creation, should not be shared
  createdAt     : { type: Date, default: Date.now },
  user          : { type: Schema.ObjectId, ref:'User' } // who created the application?
});

ApplicationSchema.plugin(require('mongoose-lifecycle'));

ApplicationSchema.pre('save', function(next) {
 console.log('Saving Application...', this); 
 
 // generate token and secret before save
 this.clientID = utils.uid(20);
 this.clientSecret = utils.uid(32);
 
  next();
});

module.exports = mongoose.model('Application', ApplicationSchema);
