/**
 * User schema for mongoose.
 */
var mongoose = require('mongoose');
var hash = require('../util/hash');

UserSchema = mongoose.Schema({
	username: String,
	salt: String,
	hash: String,
	email: String,
	name: String,
	phone: String,
	address: String
});

/**
 * Method to signup a new user. If first computes hash and salt to save password. Then creates a new model in MongoDB with given inputs and computed hash.
 * @param String username
 * @param String password
 * @param String email
 * @param String name
 * @param String phone
 * @param String address
 * @param Function callback
 */
UserSchema.statics.signup = function(username, password, email, name, phone, address, done){
	var user = this;
	hash(password, function(err, salt, hash){
		if(err) {		
			throw err;
		}

		user.create({
			username : username,
			phone : phone,
			address : address,
			email : email,
			salt : salt,
			hash : hash
		}, function(err, user){
			if(err) throw err;
			done(err, user);
		});
	});
}

/**
 * Checks whether or not the given password is valid, for the given username.
 * @param String username
 * @param String password
 * @param Funtion callback
 */
UserSchema.statics.isValidUserPassword = function(username, password, done) {
	this.findOne({username : username}, function(err, user){
		if(err) return done(err);
		if(!user) return done(null, false, { message : 'Incorrect username.' });
		hash(password, user.salt, function(err, hash){
			if(err) return done(err);
			if(hash == user.hash) return done(null, user);
			done(null, false, {
				message : 'Incorrect password'
			});
		});
	});
};

var User = mongoose.model("User", UserSchema);
module.exports = User;