const express = require("express");
const router = express.Router();

const Table = require("../models/Table");

// Get All Tables
router.get("/", async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Table Status
router.put("/:id", async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Table Updated Successfully",
      table
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;