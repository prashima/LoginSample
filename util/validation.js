/**
 * Validation util to help with authentication related operations.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');

/**
 * Checks if the the given request is authenticate or not. If not, then redirect to login page.
 * @param Http request
 * @param Http response
 * @param Funtion callback
 */
exports.isAuthenticated = function (req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/login");
    }
}

/**
 * Checks if the user for given request already exists in the system. If yes, then resets the view/redirects to 'back'.
 * @param Http request
 * @param Http response
 * @param Funtion callback
 */
exports.userExist = function(req, res, next) {
    User.count({
        username: req.body.username
    }, function (err, count) {
		console.log('inside userExists method count = ' + count);
        if (count === 0) {
            next();
        } else {
            res.locals.message = req.flash('error', "Username already exists!!");
			res.redirect('back');
        }
    });
}