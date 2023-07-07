const ErrorHandler = require("../utils/errorHandler");
const Farmer = require("../models/farmer");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Login first to access the resource."));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await Farmer.findById(decoded.id);
  next();
});
