const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const Crop = require("./crop");

const farmerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "please fill your first name"],
    min: [3, "can't be less then 3 characters"],
    max: 20,
  },
  lastName: {
    type: String,
    required: [true, "please fill your last name"],
    min: 3,
    max: 20,
  },
  dob: {
    type: Date,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
    min: [10, "please enter valid contact no."],
    max: 10,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "please enter the email ID"],
    unique: true,
    validate: [validator.isEmail, "Invalid email"],
  },
  land: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 16,
    select: false,
  },
  crops: [
    {
      type: String,
    },
  ],
  orders: [
    {
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
      company: {
        type: String,
      },
      reqArea: {
        type: Number,
      },
      crops: {
        type: String,
      },
      amount: {
        type: Number,
      },
    },
  ],
});

farmerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

farmerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

farmerSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

module.exports = new mongoose.model("Farmer", farmerSchema);
