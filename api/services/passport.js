var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy;
var FB = require("fb");

function findById(id, fn) {
  User.findOne(id).done(function (err, user) {
    if (err) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
  });
}

function findByFacebookId(id, fn) {
  User.findOne({
    facebookId: id
  }).done(function (err, user) {
    if (err) {
      return fn(null, null);
    } else {
      return fn(null, user);
    }
  });
}

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new FacebookStrategy({
    clientID: "574894572634219",
    clientSecret: "5ed6ad8e9c13a2495f25079c7e3f369a",
	  callbackURL: "/user/facebook/callback",
	  enableProof: false
  }, function (accessToken, refreshToken, profile, done) {

		//To make a Facebook API call:
		/*FB.api('me/likes', {
			access_token: accessToken
		}, function(result) {
			console.log(JSON.stringify(result));
		});*/

    findByFacebookId(profile.id, function (err, user) {

			console.log(JSON.stringify(profile));

      // Create a new User if it doesn't exist yet
      if (!user) {
        User.create({

          facebookId: profile.id,
					name: profile.displayName

          // You can also add any other data you are getting back from Facebook here 
          // as long as it is in your model

        }).done(function (err, user) {
          if (user) {
            return done(null, user, {
              message: 'Logged In Successfully'
            });
          } else {
            return done(err, null, {
              message: 'There was an error logging you in with Facebook'
            });
          }
        });

      // If there is already a user, return it
      } else {
        return done(null, user, {
          message: 'Logged In Successfully'
        });
      }
    });
  }
));
