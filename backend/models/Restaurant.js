const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  openingTime: {
    type: String,
    required: true
  },

  closingTime: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Restaurant", restaurantSchema, "restaurant");