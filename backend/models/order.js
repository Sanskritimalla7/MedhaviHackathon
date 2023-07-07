const mongoose = require("mongoose");

const orderschema = new mongoose.Schema({
  crop: {
    type: String,
  },
  quantity: {
    type: Number,
  },
});

module.exports = new mongoose.model("Order", orderschema);
