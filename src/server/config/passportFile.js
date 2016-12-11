const passport = require('passport');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const express = require('express');
const LocalStrategy = require('passport-local').Strategy;

//-USER SCHEMA
const userSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true}
});

userSchema.methods.generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);

//-SESSIONS
passport.serializeUser((user, done) => { //for session use
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const isLoggedIn = (req, res, next) => { //check session active
  if (req.isAuthenticated()) {
    return next();
  }
  res.send('unauthorized');
};

//-AUTH
passport.use('login',
  new LocalStrategy((username, password, done) => {
    User.findOne({
      'username': username
    }, (err, data) => {
      if (!data) {
        console.log('user not found');
        return done(null, false);
      }
      if (!data.comparePassword(password)) {
        console.log('invalid password');
        return done(null, false);
      } else {
        return done(null, username);
      }
    });
  })
);

passport.use('signup', new LocalStrategy((username, password, done) => {
  process.nextTick(() => {
    User.find({'username': username}, (err, data) => {
      if (!data.length) {
        const temp = new User({ //create a new user to store in db
          username
        });
        temp.password = temp.generateHash(password);
        temp.save(err => {
          if (err) {
            throw err;
          }
          console.log('registered user', username);
          return done(null, username);
        });
      } else {
        console.log('user already exists');
        return done(null, false);
      }
    });
  });
}));

module.exports = {
  isLoggedIn: isLoggedIn,
  passport: passport
};


