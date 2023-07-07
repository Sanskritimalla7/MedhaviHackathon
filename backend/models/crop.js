const mongoose = require("mongoose");

const cropScema = new mongoose.Schema({
  name: String,
});

module.exports = new mongoose.model("Crop", cropScema);
