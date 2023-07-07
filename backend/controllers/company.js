const Company = require("../models/company");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");

exports.registerCompany = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    contactNo,
    companyName,
    email,
    gst,
    password,
    orders,
  } = req.body;
  console.log("hi");
  const user = await Company.create({
    firstName,
    lastName,
    contactNo,
    companyName,
    email,
    gst,
    password,
    orders,
  });
  sendToken(user, 201, res);
});

exports.loginCompany = catchAsyncError(async (req, res, next) => {
  const { email, password, contactNo } = req.body;
  if (!password) {
    return next(new ErrorHandler("Please enter a password", 400));
  }
  let user;
  if (email || contactNo) {
    if (email) {
      user = await Company.findOne({ email }).select("+password");
    } else {
      user = await Company.findOne({ contactNo }).select("+password");
    }
  } else {
    return next(
      new ErrorHandler("Please enter a email or contact number", 400)
    );
  }
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const isPasswordMattched = await user.comparePassword(password);
  if (!isPasswordMattched) {
    return next(new ErrorHandler("Incorrect Password", 401));
  }
  sendToken(user, 200, res);
});
