Name:Darshika Gudaji 
Roll No:529

# Restaurant Reservation System

A web-based Restaurant Reservation System developed using HTML, CSS and JavaScript for the frontend, Node.js + Express for the backend, and MongoDB for database management. The system provides separate functionality for Customers and Admin.

## 1. Prerequisites

- Node.js
- MongoDB
- MongoDB Compass
- Visual Studio Code
- Web Browser

MongoDB should be running locally.

Connect MongoDB Compass to:

mongodb://localhost:27017/

## 2. Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose
- MongoDB Compass

### Tools
- Visual Studio Code
- Live Server

## 3. Setup

Open the `RESTAURANT_RESERVATION` folder in VS Code.

Project structure:

RESTAURANT_RESERVATION/
├── backend/
└── frontend/

Open the terminal and go to the backend folder:

cd backend

Install dependencies:

npm install

Make sure MongoDB is running.

Connect MongoDB Compass to:

```mongodb://localhost:27017/```

## 4. Run the Application

Start the backend:

npm run dev

Backend server:

```http://localhost:5000```

Then open the frontend using VS Code Live Server.

## 5. What Each Role Can Do

### Customer

- Register and login
- View restaurant information
- Select number of guests
- View suitable available tables
- Make a reservation
- View My Bookings
- View reservation status
- Cancel a reservation
- Logout

### Admin

- Login to Admin panel
- View customers
- View tables and availability
- View all reservations
- Confirm or reject reservations
- Mark reservations as completed
- View today's reservations
- View upcoming reservations
- View dashboard statistics
- Logout

## 6. Reservation Process

Customer logs in and enters the reservation details.

The system displays suitable tables according to the number of guests.

The customer selects a table, date and time and confirms the reservation.

The reservation is stored in MongoDB.

The admin can view and manage the reservation from the Admin panel.

## 7. Project Structure

```text
RESTAURANT_RESERVATION/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── book-reservation.html
│   ├── mybookings.html
│   ├── admin.html
│   ├── admin-reservation.html
│   ├── customers.html
│   ├── tables.html
│   ├── today-reservations.html
│   └── upcoming-reservations.html
│
└── README.md
```

## 8. MongoDB Collections

The project uses MongoDB to store application data.

Main collections:

- `users` — Stores customer and admin account information.
- `restaurant` — Stores restaurant details.
- `tables` — Stores table numbers, seating capacity and availability.
- `reservations` — Stores customer reservation details and status.

MongoDB Compass can be used to view the database and collections.

## 9. Troubleshooting

### Backend Server Error

Make sure the backend is running:

```http://localhost:5000```

Also check the terminal and browser console for errors.

### MongoDB Connection Problem

Make sure MongoDB is running and MongoDB Compass can connect to:

``` mongodb://localhost:27017/```

Check the MongoDB connection settings in the backend.

### No Data in MongoDB

Make sure the application is connected to MongoDB.

Register a customer or make a reservation and then refresh MongoDB Compass to view the stored data.

### Tables Not Appearing

Enter the number of guests. The system displays tables that have enough seats and are available.

### My Bookings Empty

Make sure you are logged in with the same customer account used to make the reservation.

## 10. Testing

The following operations were tested:

- Customer registration
- Customer login
- Admin login
- Table availability
- Guest-based table selection
- Reservation booking
- My Bookings
- Reservation cancellation
- Admin reservation management
- Today's reservations
- Upcoming reservations
- Logout
- MongoDB data storage

## 11. Project Objective

The objective of the Restaurant Reservation System is to provide a simple web-based platform for restaurant table reservations.

The system allows customers to make reservations online and allows the admin to manage customers, tables and reservations through the Admin panel.

