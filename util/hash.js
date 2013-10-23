/**
 * Utility module to - 1) compute hash for a new password, 2) compute hash for given password and compare with existing one
 */


/**
 * Module dependencies.
 */

var crypto = require('crypto');

/**
 * Bytesize.
 */

var len = 128;

/**
 * Iterations. ~300ms
 */

var iterations = 12000;

/**
 * Hashes a password with optional `salt`, otherwise
 * generate a salt for `pwd` and invoke given callback function.
 *
 * @param String password, to hash
 * @param String salt, optional
 * @param Function callback
 */

module.exports = function (pwd, salt, fn) {
  if (3 == arguments.length) {    
    crypto.pbkdf2(pwd, salt, iterations, len, fn);
  } else {
		fn = salt;
		crypto.randomBytes(len, function(err, salt){
		if (err) return fn(err);
		salt = salt.toString('base64');
		crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
        if (err) return fn(err);
        fn(null, salt, hash);
      });
    });
  }
};