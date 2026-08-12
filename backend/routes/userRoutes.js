const express = require("express");
const router = express.Router();

const User = require("../models/User");

// ======================================
// REGISTER USER
// ======================================

router.post("/register", async (req, res) => {

    try {

        const { name, username, phone, password } = req.body;

        const existingUser = await User.findOne({ username });

        if (existingUser) {

            return res.status(400).json({
                message: "Username already exists"
            });

        }

        const user = new User({

            name,
            username,
            phone,
            password,
            role: "customer"

        });

        await user.save();

        res.status(201).json({
            message: "Registration Successful"
        });

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

// ======================================
// LOGIN
// ======================================

router.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        const user = await User.findOne({

            username,
            password

        });

        if (!user) {

            return res.status(400).json({
                message: "Invalid Username or Password"
            });

        }

        res.json({

            message: "Login Successful",

            user

        });

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

// ======================================
// FORGOT PASSWORD
// ======================================

router.put("/forgot-password", async (req, res) => {

    try {

        const {

            username,
            phone,
            newPassword

        } = req.body;

        const user = await User.findOne({

            username,
            phone

        });

        if (!user) {

            return res.status(404).json({

                message: "Username or Phone Number is incorrect"

            });

        }

        user.password = newPassword;

        await user.save();

        res.json({

            message: "Password Updated Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

// ======================================
// GET ALL USERS (ADMIN)
// ======================================

router.get("/", async (req, res) => {

    try {

        const users = await User.find().sort({

            name: 1

        });

        res.json(users);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

// ======================================
// GET TOTAL CUSTOMERS
// ======================================

router.get("/count", async (req, res) => {

    try {

        const total = await User.countDocuments({

            role: { $ne: "admin" }

        });

        res.json({

            total

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

module.exports = router;