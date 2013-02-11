/**
 * Saving authorization codes
 *
 * Copyright(c) 2013 Christophe Hamerling <christophe.hamerling@gmail.com>
 * MIT Licensed
 */
 
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var AuthorizationCodeSchema = new Schema({
  code         : String,
  clientID     : String,
  redirectURI  : String,
  user         : { type: Schema.ObjectId, ref:'User' },
  createdAt    : { type: Date, default: Date.now }
});

AuthorizationCodeSchema.pre('save', function(next) {
 console.log('saving authorization code', this); 
  next();
});

AuthorizationCodeSchema.plugin(require('mongoose-lifecycle'));

mongoose.model('AuthorizationCode', AuthorizationCodeSchema);
