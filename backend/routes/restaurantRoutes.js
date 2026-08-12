const express = require("express");
const router = express.Router();

const Restaurant = require("../models/Restaurant");

router.get("/", async (req, res) => {
    try {
        const restaurant = await Restaurant.find();
        console.log(restaurant);
        res.json(restaurant);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;