const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

// Connect Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Middleware
app.use(express.json());

// Import Routes
const userRoutes = require("./routes/userRoutes");
const tableRoutes = require("./routes/tableRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");


// Use Routes
app.use("/users", userRoutes);
app.use("/tables", tableRoutes);
app.use("/reservations", reservationRoutes);
app.use("/restaurant", restaurantRoutes);


// Test Route
app.get("/", (req, res) => {
    res.send("Restaurant Reservation System Backend Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
