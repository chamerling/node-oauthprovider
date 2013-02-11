/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login')
  }
  next()
};

/**
 * User authorizations routing middleware
 * Check if the current user can see the user object
 */
exports.user = {
  hasAuthorization : function (req, res, next) {
    if (req.profile.id != req.user.id) {
      return res.redirect('/users/'+req.profile.id)
    }
    next()
  }
};

/*
 * Application authorizations routing middleware
 * Check if the current user can see the application 
 */
exports.application = {
  hasAuthorization : function (req, res, next) {
    if (req.application.user != req.user.id) {
      return res.redirect('/applications/')
    }
    next()
  }
};
