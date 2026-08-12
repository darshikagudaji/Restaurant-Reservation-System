const express = require("express");
const router = express.Router();

const Reservation = require("../models/Reservation");
const Table = require("../models/Table");

// ======================================
// BOOK TABLE
// ======================================

router.post("/book", async (req, res) => {

    try {

        const {
            customerName,
            username,
            phone,
            tableNumber,
            reservationDate,
            reservationTime,
            guests
        } = req.body;

        const existingReservation = await Reservation.findOne({

            tableNumber,
            reservationDate,
            reservationTime,

            status: {
                $nin: ["Cancelled", "Rejected"]
            }

        });

        if (existingReservation) {

            return res.status(400).json({

                message: "This table is already booked for the selected date and time."

            });

        }

        const reservation = new Reservation({

            customerName,
            username,
            phone,
            tableNumber,
            reservationDate,
            reservationTime,
            guests,
            status: "Pending"

        });

        await reservation.save();

        // Update Table Status
        await Table.findOneAndUpdate(

            { tableNumber: Number(tableNumber) },

            { status: "Booked" }

        );

        res.status(201).json({

            message: "Reservation Booked Successfully"

        });

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});

// ======================================
// VIEW ALL RESERVATIONS
// ======================================

router.get("/", async (req, res) => {

    try {

        const reservations = await Reservation.find().sort({

            reservationDate: 1,
            reservationTime: 1

        });

        res.json(reservations);

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});

// ======================================
// MY BOOKINGS
// ======================================

router.get("/mybookings/:username", async (req, res) => {

    try {

        const reservations = await Reservation.find({

            username: req.params.username

        }).sort({

            reservationDate: -1,
            reservationTime: -1

        });

        res.json(reservations);

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});

// ======================================
// CANCEL RESERVATION
// ======================================

router.put("/cancel/:id", async (req, res) => {

    try {

        const reservation = await Reservation.findById(req.params.id);

        await Reservation.findByIdAndUpdate(req.params.id, {

            status: "Cancelled"

        });

        await Table.findOneAndUpdate(

            { tableNumber: reservation.tableNumber },

            { status: "Available" }

        );

        res.json({

            message: "Reservation Cancelled Successfully"

        });

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});

// ======================================
// CONFIRM RESERVATION
// ======================================

router.put("/confirm/:id", async (req, res) => {

    try {

        await Reservation.findByIdAndUpdate(req.params.id, {

            status: "Confirmed"

        });

        res.json({

            message: "Reservation Confirmed Successfully"

        });

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});

// ======================================
// REJECT RESERVATION
// ======================================

router.put("/reject/:id", async (req, res) => {

    try {

        const reservation = await Reservation.findById(req.params.id);

        await Reservation.findByIdAndUpdate(req.params.id, {

            status: "Rejected"

        });

        await Table.findOneAndUpdate(

            { tableNumber: reservation.tableNumber },

            { status: "Available" }

        );

        res.json({

            message: "Reservation Rejected Successfully"

        });

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});

// ======================================
// UPDATE STATUS
// ======================================

router.put("/status/:id", async (req, res) => {

    try {

        const { status } = req.body;

        const reservation = await Reservation.findById(req.params.id);

        await Reservation.findByIdAndUpdate(req.params.id, {

            status

        });

        // Free table if reservation ends
        if (status === "Completed" || status === "Cancelled") {

            await Table.findOneAndUpdate(

                { tableNumber: reservation.tableNumber },

                { status: "Available" }

            );

        }

        res.json({

            message: "Reservation Status Updated"

        });

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});

// ======================================
// DASHBOARD STATISTICS
// ======================================

router.get("/stats", async (req, res) => {

    try {

        const today = new Date().toISOString().split("T")[0];

        const totalReservations = await Reservation.countDocuments();

        const todayReservations = await Reservation.countDocuments({

            reservationDate: today

        });

        const confirmedReservations = await Reservation.countDocuments({

            status: "Confirmed"

        });

        const cancelledReservations = await Reservation.countDocuments({

            status: "Cancelled"

        });

        const bookedTables = await Reservation.countDocuments({

            status: {
                $in: ["Pending", "Confirmed"]
            }

        });

        const totalTables = await Table.countDocuments();

        const availableTables = await Table.countDocuments({

            status: "Available"

        });

        res.json({

            totalReservations,
            todayReservations,
            confirmedReservations,
            cancelledReservations,
            bookedTables,
            availableTables,
            totalTables

        });

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});

module.exports = router;