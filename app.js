/*
	Main application file. Contains following
	- Required modules for this file
	- Application configuration
	- Connection to MongoDB using 'mongoose'
	- Configuration for 'passport' module to support authentication
	- Route handlers for different GET and POST http calls
*/

/*
	Required modules
*/
var express = require('express');
var app = express();
var hbs = require('hbs');
var passport = require('passport');
var path = require('path');
var mongoose = require('mongoose');
var Users = require('./models/user');
var Auth = require('./util/validation.js');
var hash = require('./util/hash.js');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

/*
	Application configuration
*/
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/*
	DB connection. Server is running on MongoLab.
*/
mongoose.connection.on('open', function (ref) {
  console.log('Connected to mongo server.');
});

mongoose.connection.on('error', function(err) {
	console.log('Error during db connection ' + err);
});

mongoose.connect('mongodb://test:test@ds051378.mongolab.com:51378/sample');

/*
	Passport configuration
	- Serialization/deserialization methods to store session information.
	- LocalStrategy to define how the input should be authenticated.
*/
passport.serializeUser(function(user, done) {
                done(null, user.username);
});

passport.deserializeUser(function(username, done) {
		Users.findOne({ username: username }, function (err, user) {
				done(err, user);
		});
});
		
passport.use(new LocalStrategy(function(username, password, done){
	console.log('LocalStrategy called un =' + username + ' pw = ' + password);
    Users.findOne({ username : username},function(err,user){
		console.log('User.findOne callback err = ' + err + ' user =' + user);
        if(err) { return done(err); }
        if(!user){
            return done(null, false, { message: 'Incorrect username.' });
        }

        hash( password, user.salt, function (err, hash) {
            if (err) { return done(err); }
            if (hash == user.hash) return done(null, user);
            done(null, false, { message: 'Incorrect password.' });
        });
    });
}));


/*
	Route handlers for 
	- '/' GET 
	- '/login' GET 
	- '/login' POST
	- '/register' GET 
	- '/register' POST 
	- '/welcome' GET 
	- '/logout' GET
*/
app.get('/', function(request, response) {
	response.render('login');
});

app.get('/login', function(request, response){ 
	response.render('login', { message: request.flash('error') });
});

app.post('/login'
			,passport.authenticate('local',{
			successRedirect : "/welcome",
			failureRedirect : "/login",
			failureFlash: "Invalid username or password."
		})
);


app.get('/welcome', Auth.isAuthenticated, function(request, response) {
		response.render('welcome', {username:request.user.username});
});

app.get('/register', function(request, response) {
	response.render('registration',  {locals: {flash: request.flash()}});
});

app.post('/register',Auth.userExist, function (request, response, next) {
console.log(request.body);
		Users.signup(request.body.username, request.body.password, request.body.email, request.body.name, request.body.phone, request.body.address, function(err, user){
			if(err) {
				console.log('Error occured while called signup method ' + err);
				throw err;
			}
			request.login(user, function(err){
				if(err) return next(err);
				return response.render('welcome', {username:request.body.username});
		});
	});
});
	
app.get('/logout', function(request, response){
	request.logout();
	response.redirect('login');
});

app.listen(3000);