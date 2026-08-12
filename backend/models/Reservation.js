const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({

    customerName: {
        type: String,
        required: true
    },

    username: {
    type: String,
    required: true
    },

    phone: {
        type: String,
        required: true
    },

    tableNumber: {
        type: Number,
        required: true
    },

    reservationDate: {
        type: String,
        required: true
    },

    reservationTime: {
        type: String,
        required: true
    },

    guests: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        default: "Pending"
    }

});

module.exports = mongoose.model("Reservation", reservationSchema);