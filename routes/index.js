//jshint esversion: 6
const express = require("express");
const router = express.Router();
const passport = require("passport");
const {ensureAuthenticated, doctorAuthenticated} = require("../config/auth");


//Passport Config
const login = require("../config/passport");

//bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

//User model
const User = require("../models/User");

//Doctor model
const Doctor = require("../models/Doctor");

//Home Page
router.get("/", (req, res) => res.render("home"));

//User login page
router.get("/login", (req, res) => res.render("login"));

// Login
router.post('/login', (req, res, next) => {
  login.userLogin(passport);

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.authenticate('user', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});


//User register page
router.get("/register", (req, res) => res.render("register"));

//User register handle
router.post("/register", (req, res) => {
  const {name, email, password, currentAddress, permanentAddress, city, state, zip} = req.body;
  let errors = [];

  //Check required fields
  if(!name || !email || !password || !currentAddress || !permanentAddress || !city || !state || !zip){
    errors.push({msg: "Please fill all the fields"});
  }

  //Check password length
  if(password.length < 8){
    errors.push({msg: "Password should be atleast 8 characters"});
  }

  if(errors.length > 0){
    res.render("register", {errors, name, email, password, currentAddress, permanentAddress, city, state, zip});
  } else {
    //Validation passed
    User.findOne({email: email}, function(err, foundUser) {
      if (!err) {
        if (foundUser) {
          errors.push({msg: "Email already registered"});
          res.render("register", {errors, name, email, password, currentAddress, permanentAddress, city, state, zip});
        } else {
          bcrypt.hash(password, saltRounds, function(err, hash) {
            const user = new User({name, email, password: hash, currentAddress, permanentAddress, city, state, zip});

            user.save(function(err) {
              if (!err) {
                req.flash("success_msg", "You are now registered and can Log in");
                res.redirect("/login");

              } else {
                res.send(err);
              }
            });
          });

        }
      } else {
        res.send(err);
      }

    });
  }
});

//Doctor register page
router.get("/doctor-register", (req, res) => res.render("doctorRegister"));

//Doctor registeration handling
router.post("/doctor-register", (req, res) => {
  const {name, email, password, clinicAddress, openingTime, specialization, city, state, zip} = req.body;
  let errors = [];

  //Check required fields
  if(!name || !email || !password || !clinicAddress || !openingTime || !specialization || !city || !state || !zip){
    errors.push({msg: "Please fill all the fields"});
  }

  //Check password length
  if(password.length < 8){
    errors.push({msg: "Password should be atleast 8 characters"});
  }

  if(errors.length > 0){
    res.render("doctorRegister", {errors, name, email, password, clinicAddress, openingTime, specialization, city, state, zip});
  } else {
    //Validation passed
    Doctor.findOne({email: email}, function(err, foundUser) {
      if (!err) {
        if (foundUser) {
          errors.push({msg: "Email already registered"});
          res.render("doctorRegister", {errors, name, email, password, clinicAddress, openingTime, specialization, city, state, zip});
        } else {
          bcrypt.hash(password, saltRounds, function(err, hash) {
            const doctor = new Doctor({name, email, password: hash, clinicAddress, openingTime, specialization, city, state, zip});

            doctor.save(function(err) {
              if (!err) {
                req.flash("success_msg", "You are now registered and can Log in");
                res.redirect("/doctor-login");

              } else {
                res.send(err);
              }
            });
          });

        }
      } else {
        res.send(err);
      }

    });
  }
});

//Doctor login page
router.get("/doctor-login", (req, res) => res.render("doctorLogin"));

// Doctor Login
router.post('/doctor-login', (req, res, next) => {
  login.doctorLogin(passport);

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    Doctor.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.authenticate("doctor", {
    successRedirect: '/doctor-dashboard',
    failureRedirect: '/doctor-login',
    failureFlash: true
  })(req, res, next);
});

//Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard");

});

//Doctor Dashboard
router.get("/doctor-dashboard", doctorAuthenticated, (req, res) => {
  res.render("doctorDashboard");
  // console.log(req.user);
});

//Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
});

//Book an Appointment
router.get("/book-appointment", ensureAuthenticated, (req, res) => {
  res.render("bookAppointment");
});

//Get to know the booked appointment
router.get("/booked-appointment", ensureAuthenticated, (req, res) => {
  const doctorId = req.user.doctorId;

  Doctor.findById({_id: doctorId}, (err, foundDoctor) => {
    if(!err) {
      if(foundDoctor) {
        res.render("bookedAppointment", {doctor: foundDoctor});
      } else {
        req.flash("error_msg", "You have no upcoming appointment");
        res.redirect("/dashboard");
      }
    } else {
      req.flash("error", "You have no upcoming appointment");
      res.redirect("/dashboard");
    }
  });
});


//Get specialization
router.get("/book-appointment/:specialization", ensureAuthenticated, (req, res) => {
  const specialization = req.params.specialization;
  const zip = req.user.zip;

  Doctor.find({specialization: specialization, zip: zip}, (err, foundDoctors) => {
      if (!err) {
        res.render("doctorLists", {foundDoctors: foundDoctors});
      } else {
        console.log(err);
      }
    });
  });

  //Booking an appointment
  router.post("/book-appointment", ensureAuthenticated, (req, res) => {
    const doctorId = req.body.doctorId;
    const user = req.user;
    const userId = req.user._id;

    User.findByIdAndUpdate(userId, {$set: {doctorId: doctorId}}, function(err){
      if (!err) {
        Doctor.findByIdAndUpdate({_id: doctorId}, {$push: {patientId: user}}, function(err){
          if(!err) {
            req.flash("success_msg", "You have successfully booked a doctor");
            res.redirect("/dashboard");
          }
        });
      } else {
        req.flash("error_msg", "Booking unsuccessfull. Please try again");
        res.redirect("/dashboard");
      }
    });

  });

  //All the pending appointments
  router.get("/appointments-pending", doctorAuthenticated, (req, res) => {
    const patients = req.user.patientId;
    res.render("appointmentsPending", {patients: patients});
  });

  //Done with appointment
  router.post("/appointments-pending", doctorAuthenticated, (req, res) => {
    const patientId = req.body.patientId;
    const doctorId = req.user._id;

    User.findByIdAndUpdate(patientId, {$set: {doctorId: undefined}}, function(err){
      if (!err) {
        Doctor.findByIdAndUpdate({_id: doctorId}, {$pull: {patientId: {_id: patientId}}}, function(err){
          if(!err) {
            req.flash("success_msg", "Successfully done with patient checkup. Please generate a report");
            res.redirect("/doctor-dashboard");
          }
        });
      } else {
        req.flash("error_msg", "Something went wrong. Please try again");
        res.redirect("/doctor-dashboard");
      }
    });

  });

module.exports = router;
