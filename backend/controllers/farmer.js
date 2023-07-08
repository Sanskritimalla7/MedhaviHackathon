const Farmer = require("../models/farmer");
const ErrorHandler = require("../utils/errorHandler");
const ApiFeatures = require("../utils/apiFeatures");
const catchAsyncError = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");

exports.registerFarmer = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    dob,
    contactNo,
    email,
    // aadhar,
    land,
    password,
    crops,
    orders,
  } = req.body;
  console.log(req.body);
  const user = await Farmer.create({
    firstName,
    lastName,
    dob,
    contactNo,
    email,
    // aadhar,
    land,
    password,
    crops,
    orders,
  });
  sendToken(user, 201, res);
});

exports.loginFarmer = catchAsyncError(async (req, res, next) => {
  const { email, password, contactNo } = req.body;
  if (!password) {
    return next(new ErrorHandler("Please enter a password", 400));
  }
  let user;
  if (email || contactNo) {
    if (email) {
      user = await Farmer.findOne({ email }).select("+password");
    } else {
      user = await Farmer.findOne({ contactNo }).select("+password");
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

exports.getfarmers = catchAsyncError(async (req, res, next) => {
  const resPerPage = 8;
  const apiFeatures = new ApiFeatures(Farmer.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  const farmers = await apiFeatures.query;

  res.status(200).json({
    sucess: true,
    farmers,
  });
});

exports.getOrder = catchAsyncError(async (req, res, next) => {
  const farmer = await Farmer.findById(req.params.id);
  if (!farmer) {
    return next(new ErrorHandler("Farmer not found", 404));
  }
  const newOreder = req.body;

  farmer.orders.push(newOreder);
  farmer.save();
  res.status(200).json({
    success: true,
  });
});
