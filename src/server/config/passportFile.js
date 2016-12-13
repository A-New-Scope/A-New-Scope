// Passport's sole purpose is to authenticate requests,
// which it does through an extensible set of plugins known as strategies.
// The API is simple: you provide Passport a request to authenticate,
// and Passport provides hooks for controlling what occurs when authentication succeeds or fails.

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
passport.serializeUser((user, done) => { // serializes the user ID
  done(null, user);
});

passport.deserializeUser((user, done) => { // interprets the serialized ID to find the user
  done(null, user);
});

const isLoggedIn = (req, res, next) => { //check session active
  if (req.isAuthenticated()) {
    return next();
  }
  res.send('unauthorized');
};

//-AUTH

/* 
  Before authenticating requests, the strategy (or strategies) used by an application must be configured.
*/
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

/*
process.nextTick() defers the function until a completely new stack.
You can call as many functions as you want in the current stack.
The function that called nextTick has to return, as well as its parent,
all the way up to the root of the stack. Then when the event loop is looking for
a new event to execute, your nextTick'ed function will be there in the event queue
and execute on a whole new stack.
 */
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
  isLoggedIn: isLoggedIn,   // to be used in router.js file
  passport: passport        // to be used in router.js file
};
