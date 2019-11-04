//jshint esversion: 6
const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
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
  clinicAddress: {
    type: String,
    required: true
  },
  openingTime: {
    type: String,
    required: true
  },
  specialization: {
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
  }
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
