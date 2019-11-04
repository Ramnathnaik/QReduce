//jshint esversion: 6
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//Load user model
const User = require("../models/User");

//Load doctor model
const Doctor = require("../models/Doctor");

exports.userLogin = function(passport) {
  passport.use("user",
    new LocalStrategy({usernameField: "email"}, (email, password, done) => {
      User.findOne({email: email}, function(err, user){
        if (!err) {
          if (!user) {
            return done(null, false, {message: "This email is not registered"});
          }

          //Match Password
          bcrypt.compare(password, user.password, function(err, result) {
          if (result === true) {
            return done(null, user);
          } else {
            return done(null, false, {message: "Password incorrect"});
          }
        });
        } else {
          console.log(err);
        }
      });
    })
  );

};

exports.doctorLogin = function(passport) {
  passport.use("doctor",
    new LocalStrategy({usernameField: "email"}, (email, password, done) => {
      Doctor.findOne({email: email}, function(err, user){
        if (!err) {
          if (!user) {
            return done(null, false, {message: "This email is not registered"});
          }

          //Match Password
          bcrypt.compare(password, user.password, function(err, result) {
          if (result === true) {
            return done(null, user);
          } else {
            return done(null, false, {message: "Password incorrect"});
          }
        });
        } else {
          console.log(err);
        }
      });
    })
  );

};
