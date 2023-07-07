const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const CompanySchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, " required field"],
    min: [3, "please enter valid name"],
    max: 20,
  },
  lastName: {
    type: String,
    required: [true, "required field"],
    min: 3,
    max: 4,
  },
  companyName: {
    type: String,
    required: [true, "required field"],
  },
  contactNo: {
    type: String,
    required: [true, "required field"],
    min: [10, "please enetr valid contact no."],
    max: 10,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "required field"],
    unique: true,
    validate: [validator.isEmail, "invalid email id"],
  },
  gst: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 16,
  },
  orders: [
    {
      to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Farmer",
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

CompanySchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

CompanySchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

CompanySchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};
module.exports = new mongoose.model("Company", CompanySchema);
