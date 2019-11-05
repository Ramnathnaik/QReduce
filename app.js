//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const flash = require("connect-flash");
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

//Set express
const app = express();

//Set EJS
app.set('view engine', 'ejs');

//Set body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));

//Set express to konw where local file is located
app.use(express.static( "public"));

//Express session
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global Variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//DB Config
const db = require("./config/keys").MongoURI;

//Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

mongoose.set('useCreateIndex', true);

//Routes

app.use("/", require("./routes/index"));

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
