const Farmer = require("../models/order");
const ErrorHandler = require("../utils/errorHandler");
const ApiFeatures = require("../utils/apiFeatures");
const catchAsyncError = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const order = require("../models/order");

exports.ordersFarmer = catchAsyncError(async (req, res, next) => {
  const {
   orders,
   quantity
  } = req.body;
  console.log(req.body);
  const user = await Farmer.create({
    orders,
    quantity

  });
  sendToken(user, 201, res);
});

// exports.loginFarmer = catchAsyncError(async (req, res, next) => {
//   const { email, password, contactNo } = req.body;
//   if (!password) {
//     return next(new ErrorHandler("Please enter a password", 400));
//   }
  let user;
  if (orders || quantity) {
    if (orders) {
      user = await Farmer.findOne({ orders }).select("+orders");
    } else {
      user = await Farmer.findOne({ quantity }).select("+quantity");
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
