const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/users');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => {
    console.log('login');
    console.log(req.user)
});

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => console.log(req.user));

// Register
router.post('/register', forwardAuthenticated, (req, res) => {
    console.log(req.body);
  const { username, firstName, lastName, afm, address ,country, email, password, confirmPassword} = req.body.posted_data;


 let errors = checkRegisterInput(req.body.posted_data)
console.log(errors);
  if (errors.length > 0) {
    res.set('Content-Type', 'application/json')
    .send({errors: errors});
  } else {
    User.findOne({where: {username }})
    .then(user => {
      if (user) {
          console.log('Username already exists' );
        errors.push({msg: 'Username already exists' });
        res.set('Content-Type', 'application/json')
        .send({errors: errors});
      } else {
        const newUser = {
          username,
          mail:email,
          password,
          last_name : lastName,
          name : firstName,
          AFM : afm,
          country,
          address
        }

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
              User.create(newUser).then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );

                res.set('Content-Type', 'application/json')
                .send({logged_in: false, user: {},errors: [], redirect:'/'});
              })
              .catch(err => {
                  console.log(err)
                  res.set('Content-Type', 'application/json')
                  .send({logged_in: false, user: {},errors: [{msg:err}]})
              });
          });
        });
      }
  }).catch((err => {
      console.log(err)
      res.set('Content-Type', 'application/json')
      .send({logged_in: false, user: {},errors: [{msg:err}]});
  }))
  }
});

function checkRegisterInput(input){
    const { username, firstName, lastName, afm, address ,country, email, password, confirmPassword}  = input
    let errors = [];
    if (!username || !email || !password || !confirmPassword|| !lastName || !firstName || !country || !afm|| !address) {
      errors.push({ msg: 'Please enter all fields' });
    }

    if (password !== confirmPassword) {
      errors.push({ msg: 'Passwords do not match' });
    }
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
    return errors;
}
// Login
router.post('/login', forwardAuthenticated, (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
         if (err) {
                console.log(err);
                return res.status(401).send({logged_in: false, user: {},errors:[{msg:"Couldn't find user in database"}]});

         }
         if (!user) {
             return res.status(401).send({logged_in: false, user: {},errors:[{msg:"Couldn't find user in database"}]});
         }
         req.logIn(user, function(err) {
            if (err) {
                 console.log(err);
                 return res.status(401).send({logged_in: false, user: {},errors:[{msg:"Couldn't find user in database"}]});
             }
            return res.status(200).send({logged_in: true, user: user.dataValues})
         });

 })(req, res, next)
 });

// Logout
router.delete('/logout', (req, res) => {
  req.logout();
//  req.flash('success_msg', 'You are logged out');
  res.status(200).send({logged_in: false, user: {}});
});

module.exports = router;
