const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');

module.exports ={
    auth: function(passport) {
      passport.use(
        new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
            User.findOne({where: {username
            }}).then(user => {
            if (!user) {
              return done(null, false, { message: 'That username is not registered' });
            }

            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: 'Password incorrect' });
              }
            });
          });
        })
      );


      passport.serializeUser(function(user, done) {

        done(null, user.get());
      });

      passport.deserializeUser(function(id, done) {
          console.log('deserializeUser');

          console.log(id);
        User.findByPk(id.user_id)
        .then( (user) => {
            if (user) {
                 done(null, user.get());
            }
            else{
                done(user.errors, null);
            }

        })
      });
     },
      ensureAuthenticated: function(req, res, next) {
          console.log('ensured');
        if (req.isAuthenticated()) {
          return next();
        }
        console.log('error_msg', 'Please log in to view that resource');
        return res.status(200).send({logged_in: false, user: {}})
      },
      forwardAuthenticated: function(req, res, next) {
          console.log('forwarded');
        if (!req.isAuthenticated()) {
          return next();
        }

        return res.status(200).send({logged_in: true, user: req.user})
      }
 }
