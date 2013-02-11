/**
 * User API
 *
 * Copyright(c) 2013 Christophe Hamerling <christophe.hamerling@gmail.com>
 * MIT Licensed
 */
 
var passport = require('passport')
  , mongoose = require('mongoose')
  , User = mongoose.model('User')

exports.info = [
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    console.log('Got an api call. User is', req.user.id);
    User.findOne({_id : req.user.id}, function(err, user) {
      if (err) {
        res.json({error : err.msg});
      } else {
      if (!user) {
        res.json({ error : 'User not found' });        
      } else {
        res.json({username : user.username, email : user.email, name : user.name, id : user._id});
      }
    }
    })
  }
]
