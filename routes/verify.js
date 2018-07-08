var jwt = require('jsonwebtoken');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = null;

exports.getToken = function(user) {
  return jwt.sign(user,'muffito88994',{expiresIn:3600});
};


exports.verifyUser = function(req,res,next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token) {
    jwt.verify(token,'muffito88994',function(err,decoded){
      if (err){
        var err = new Error('You are not authenticated');
        err.status = 401;
        return next(err);
      }
      else {
        req.decoded = decoded;
        next();
      } 
    });
  } else {
    var err = new Error('No token provided');
    err.status = 403;
    return next(err);
  }
}

exports.verifyOpts = function() {
  if (opts == null){
    return false;
  }
  else {
    return true;
  }
};

exports.setOpts = function(token) {
  opts = token;
};
