var passport = require('passport');
/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
	login: function(req, res) {
		res.view();
	},

	dashboard: function(req, res) {
		res.view();
	},

	logout: function(req, res) {
		req.session.user = null;
		req.session.flash = 'You have logged out';
		res.redirect('/');
	},

	'facebook': function(req, res, next) {
		passport.authenticate('facebook', { scope: ['public_profile',  'read_friendlists', 'email', 'user_about_me', 'user_likes', 'user_friends']},
				function(err, user) {
					req.logIn(user, function(err) {
						if (err) {
							console.log(err);
							req.session.flash = 'There was an error';
							res.redirect('user/login');
						} else {
							req.session.user = user;
							res.redirect('/dashboard');
						}
					});
				})(req, res, next);
	},

	'facebook/callback': function(req, res, next) {
		passport.authenticate('facebook',
				function(req, res) {
					res.redirect('/dashboard');
				})(req, res, next);
	}
};
