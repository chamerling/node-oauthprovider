/**
 * Access Token Storage
 *
 * Copyright(c) 2013 Christophe Hamerling <christophe.hamerling@gmail.com>
 * MIT Licensed
 */
 
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var AccessTokenSchema = new Schema({
  token     : String, // the access_token
  user      : { type: Schema.ObjectId, ref:'User' }, // the user linked to this access token
  clientID  : { type: Schema.ObjectId, ref:'Application'}, // the application linked to this token
  createdAt : { type: Date, default: Date.now }
});

AccessTokenSchema.pre('save', function(next) {
 console.log('saving access token', this); 
  next();
});

AccessTokenSchema.plugin(require('mongoose-lifecycle'));

mongoose.model('AccessToken', AccessTokenSchema);
