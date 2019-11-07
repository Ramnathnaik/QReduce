//jshint esversion: 6
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  medicines: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  currentAddress: {
    type: String,
    required: true
  },
  permanentAddress: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  doctorId: String,

  reports: [reportSchema]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
