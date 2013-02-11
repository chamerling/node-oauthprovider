/**
 *
 * Copyright(c) 2013 Christophe Hamerling <christophe.hamerling@gmail.com>
 * MIT Licensed
 */
 
var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , crypto = require('crypto')


var UserSchema = new Schema({
  name                : String,
  hashedPassword      : String,
  email               : String,
  username            : String,
  salt                : String,
  createdAt           : { type: Date, default: Date.now }
});

UserSchema.plugin(require('mongoose-lifecycle'));

// virtual attributes
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashedPassword = this.encryptPassword(password)
  })
  .get(function() { return this._password })

  // validations
  var validatePresenceOf = function (value) {
    return value && value.length
  }

  // the below 4 validations only apply if you are signing up traditionally

  UserSchema.path('name').validate(function (name) {
    return name.length
  }, 'Name cannot be blank')

  UserSchema.path('email').validate(function (email) {
    return email.length
  }, 'Email cannot be blank')

  UserSchema.path('username').validate(function (username) {
    return username.length
  }, 'UserSchemaname cannot be blank')

  UserSchema.path('hashedPassword').validate(function (hashedPassword) {
    return hashedPassword.length
  }, 'Password cannot be blank')

// pre save hooks
UserSchema.pre('save', function(next) {
  console.log('saving user', this); 
  
  if (!this.isNew) return next()

  if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1)
    next(new Error('Invalid password'))
  else
    next()
})

// methods
UserSchema.method('authenticate', function(plainText) {
  console.log(plainText)
  return this.encryptPassword(plainText) === this.hashedPassword
})

UserSchema.method('makeSalt', function() {
  return Math.round((new Date().valueOf() * Math.random())) + ''
})

UserSchema.method('encryptPassword', function(password) {
  if (!password) return ''
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
})

module.exports = mongoose.model('User', UserSchema);
