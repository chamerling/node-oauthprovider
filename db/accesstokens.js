var tokens = {};


exports.find = function(key, done) {
  
  console.log(tokens)
  
  var token = tokens[key];
  return done(null, token);
};

exports.save = function(token, userID, clientID, done) {
  tokens[token] = { userID: userID, clientID: clientID };
  return done(null);
};
