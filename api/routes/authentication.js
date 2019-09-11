
var express = require('express');
var router = express.Router();
const db = require('../schema/model')
const User = require('../schema/User')

const config = require('../config/config')
const bcrypt = require('bcryptjs')
const salt = 12;

const passport = require('passport'),
localStrategy = require('passport-local').Strategy,
JWTstrategy = require('passport-jwt').Strategy,
ExtractJWT = require('passport-jwt').ExtractJwt;

/* GET users listing. */
router.get('/', function(req, res, next) {

    console.log(req.query);
//    console.log(req);
    let data = {username, password} = JSON.parse(req.query.user)
    console.log(data);
    User.findOne({ where:{username, password }
    })
    .then(result => res.send('successful login'))
    .catch(err => console.error(err))
});

router.post('/', function(req, res, next) {
    console.log(req.body);
    let {username, name, last_name, mail, address, AFM, country, password} = req.body.posted_data
    User.create({
        username, name, last_name, mail, address, AFM, country, password
    })
    .then((result,res) => (

        res.send(result[0]))
    )
    .catch(err =>( console.error(err)))
});


passport.use(
  'register',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    },
    (username, password, done) => {
      try {
        User.findOne({
          where: {
            username: username,
          },
        }).then(user => {
          if (user != null) {
            console.log('username already taken');
            return done(null, false, { message: 'username already taken' });
          } else {
            bcrypt.hash(password, salt).then(hashedPassword => {
              User.create({ username, password: hashedPassword }).then(user => {
                console.log('user created');
                // note the return needed with passport local - remove this return for passport JWT to work
                return done(null, user);
              });
            });
          }
        });
      } catch (err) {
        done(err);
      }
    },
  ),
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    },
    (username, password, done) => {
      try {
        User.findOne({
          where: {
            username: username,
          },
        }).then(user => {
          if (user === null) {
            return done(null, false, { message: 'bad username' });
          } else {
            bcrypt.compare(password, user.password).then(response => {
              if (response !== true) {
                console.log('passwords do not match');
                return done(null, false, { message: 'passwords do not match' });
              }
              console.log('user found & authenticated');
              // note the return needed with passport local - remove this return for passport JWT
              return done(null, user);
            });
          }
        });
      } catch (err) {
        done(err);
      }
    },
  ),
);

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: config.jwt_secret.secret,
};

passport.use(
  'jwt',
  new JWTstrategy(opts, (jwt_payload, done) => {
    try {
      User.findOne({
        where: {
          username: jwt_payload.id,
        },
      }).then(user => {
        if (user) {
          console.log('user found in db in passport');
          // note the return removed with passport JWT - add this return for passport local
          done(null, user);
        } else {
          console.log('user not found in db');
          done(null, false);
        }
      });
    } catch (err) {
      done(err);
    }
  }),
);

  router.get('/loginUser', (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if (info != undefined) {
        console.log(info.message);
        res.send(info.message);
      } else {
        req.logIn(user, err => {
          User.findOne({
            where: {
              username: user.username,
            },
          }).then(user => {
            const token = jwt.sign({ id: user.username }, opts.secretOrKey);
            res.status(200).send({
              auth: true,
              token: token,
              message: 'user found & logged in',
            });
          });
        });
      }
    })(req, res, next);
    });


    router.get('/findUser', (req, res, next) => {
      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
          console.log(err);
        }
        if (info != undefined) {
          console.log(info.message);
          res.send(info.message);
        } else {
          console.log('user found in db from route');
          res.status(200).send({
            auth: true,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            username: user.username,
            password: user.password,
            message: 'user found in db',
          });
        }
      })(req, res, next);
    });

    router.post('/registerUser', (req, res, next) => {
      passport.authenticate('register', (err, user, info) => {
        if (err) {
          console.log(err);
        }
        if (info != undefined) {
          console.log(info.message);
          res.send(info.message);
        } else {
          req.logIn(user, err => {
            const data = {
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email,
              username: user.username,
            };
            User.findOne({
              where: {
                username: data.username,
              },
            }).then(user => {
              user
                .update({
                  first_name: data.first_name,
                  last_name: data.last_name,
                  email: data.email,
                })
                .then(() => {
                  console.log('user created in db');
                  res.status(200).send({ message: 'user created' });
                });
            });
          });
        }
      })(req, res, next);
    });



module.exports = router;
