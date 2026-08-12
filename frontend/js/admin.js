// ======================================
// API URL
// ======================================

const API_URL = "http://localhost:5000";


// ======================================
// LOGOUT
// ======================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.clear();

        window.location.href = "login.html";

    });

}


// ======================================
// DASHBOARD
// ======================================

if (document.getElementById("totalUsers")) {

    loadDashboard();

}

async function loadDashboard() {

    try {

        // Load Customers

        const users = await fetch(`${API_URL}/users`)
            .then(res => res.json());

        // Load Reservations

        const reservations = await fetch(`${API_URL}/reservations`)
            .then(res => res.json());

        // Total Customers

        document.getElementById("totalUsers").innerText =
            users.filter(user => user.role !== "admin").length;

        // Total Tables

        const TOTAL_TABLES = 10;

        document.getElementById("totalTables").innerText =
            TOTAL_TABLES;

        // Booked Tables

        const bookedTables = reservations.filter(r =>

            r.status === "Pending" ||

            r.status === "Confirmed"

        ).length;

        document.getElementById("bookedTables").innerText =
            bookedTables;

        // Available Tables

        document.getElementById("availableTables").innerText =
            TOTAL_TABLES - bookedTables;

        // Today's Reservations

        const today =
            new Date().toISOString().split("T")[0];

        document.getElementById("todayReservations").innerText =
            reservations.filter(r =>
                r.reservationDate === today
            ).length;

        // Confirmed Reservations

        document.getElementById("completedReservations").innerText =
            reservations.filter(r =>
                r.status === "Confirmed"
            ).length;

        // Cancelled Reservations

        document.getElementById("cancelledReservations").innerText =
            reservations.filter(r =>
                r.status === "Cancelled"
            ).length;

    }

    catch (error) {

        console.log(error);

    }

}


// ======================================
// LOAD CUSTOMERS
// ======================================

const customerTable =
    document.getElementById("customerTable");

if (customerTable) {

    loadCustomers();

}

async function loadCustomers() {

    try {

        const users = await fetch(`${API_URL}/users`)
            .then(res => res.json());

        customerTable.innerHTML = "";

        users.forEach(user => {

            if (user.role !== "admin") {

                customerTable.innerHTML += `

                <tr>

                    <td>${user.name}</td>

                    <td>${user.username}</td>

                    <td>${user.phone}</td>

                    <td>${user.role}</td>

                </tr>

                `;

            }

        });

    }

    catch (error) {

        console.log(error);

    }

}


// ======================================
// LOAD ALL RESERVATIONS
// ======================================

const reservationTable =
    document.getElementById("reservationTableBody");

if (reservationTable) {

    loadReservations();

}

async function loadReservations() {

    try {

        const reservations = await fetch(`${API_URL}/reservations`)
            .then(res => res.json());

        reservationTable.innerHTML = "";

        reservations.forEach(r => {

            reservationTable.innerHTML += `

            <tr>

                <td>${r.customerName}</td>

                <td>${r.phone}</td>

                <td>Table ${r.tableNumber}</td>

                <td>${r.reservationDate}</td>

                <td>${r.reservationTime}</td>

                <td>${r.guests}</td>

                <td>${r.status}</td>

                <td>

                    ${

                        r.status === "Pending"

                        ?

                        `

                        <div class="action-buttons">

                            <button
                                class="btn btn-confirm"
                                onclick="updateStatus('${r._id}','Confirmed')">

                                ✓ Confirm

                            </button>

                            <button
                                class="btn btn-reject"
                                onclick="updateStatus('${r._id}','Cancelled')">

                                ✕ Reject

                            </button>

                        </div>

                        `

                        :

                        r.status === "Confirmed"

                        ?

                        `

                        <div class="action-buttons">

                            <button
                                class="btn btn-complete"
                                onclick="updateStatus('${r._id}','Completed')">

                                ✔ Complete

                            </button>

                        </div>

                        `

                        :

                        `<span class="status-completed">Completed</span>`

                    }

                </td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}

// ======================================
// TODAY RESERVATIONS
// ======================================

const todayReservationTableBody =
    document.getElementById("todayReservationTableBody");

if (todayReservationTableBody) {

    loadTodayReservations();

}

async function loadTodayReservations() {

    try {

        const today =
            new Date().toISOString().split("T")[0];

        const reservations =
            await fetch(`${API_URL}/reservations`)
                .then(res => res.json());

        todayReservationTableBody.innerHTML = "";

        reservations
            .filter(r => r.reservationDate === today)
            .forEach(r => {

                todayReservationTableBody.innerHTML += `

                <tr>

                    <td>${r.customerName}</td>

                    <td>${r.phone}</td>

                    <td>Table ${r.tableNumber}</td>

                    <td>${r.reservationTime}</td>

                    <td>${r.guests}</td>

                    <td>${r.status}</td>

                    <td>

                        ${

                            r.status === "Pending"

                            ?

                            `

                            <div class="action-buttons">

                                <button
                                    class="btn btn-confirm"
                                    onclick="updateStatus('${r._id}','Confirmed')">

                                    ✓ Confirm

                                </button>

                                <button
                                    class="btn btn-reject"
                                    onclick="updateStatus('${r._id}','Cancelled')">

                                    ✕ Reject

                                </button>

                            </div>

                            `

                            :

                            r.status === "Confirmed"

                            ?

                            `

                            <div class="action-buttons">

                                <button
                                    class="btn btn-complete"
                                    onclick="updateStatus('${r._id}','Completed')">

                                    ✔ Complete

                                </button>

                            </div>

                            `

                            :

                            `<span class="status-completed">Completed</span>`

                        }

                    </td>

                </tr>

                `;

            });

    }

    catch (error) {

        console.log(error);

    }

}


// ======================================
// UPCOMING RESERVATIONS
// ======================================

const upcomingReservationTableBody =
    document.getElementById("upcomingReservationTableBody");

if (upcomingReservationTableBody) {

    loadUpcomingReservations();

}

async function loadUpcomingReservations() {

    try {

        const today =
            new Date().toISOString().split("T")[0];

        const reservations =
            await fetch(`${API_URL}/reservations`)
                .then(res => res.json());

        upcomingReservationTableBody.innerHTML = "";

        reservations

            .filter(r => r.reservationDate > today)

            .forEach(r => {

                upcomingReservationTableBody.innerHTML += `

                <tr>

                    <td>${r.customerName}</td>

                    <td>${r.phone}</td>

                    <td>${r.tableNumber}</td>

                    <td>${r.reservationDate}</td>

                    <td>${r.reservationTime}</td>

                    <td>${r.guests}</td>

                    <td>${r.status}</td>

                </tr>

                `;

            });

    }

    catch (error) {

        console.log(error);

    }

}


// ======================================
// UPDATE RESERVATION STATUS
// ======================================

async function updateStatus(id, status) {

    try {

        const response = await fetch(

            `${API_URL}/reservations/status/${id}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    status

                })

            }

        );

        const data = await response.json();

        alert(data.message);

        loadDashboard();

        if (reservationTable) {

            loadReservations();

        }

        if (todayReservationTableBody) {

            loadTodayReservations();

        }

        if (upcomingReservationTableBody) {

            loadUpcomingReservations();

        }

        if (tableBody) {

            loadTables();

        }

    }

    catch (error) {

        console.log(error);

    }

}

// ======================================
// TABLE MANAGEMENT
// ======================================

const tableBody = document.getElementById("tableBody");

if (tableBody) {

    loadTables();

}

async function loadTables() {

    try {

        // Load tables from database
        const tables = await fetch(`${API_URL}/tables`)
            .then(res => res.json());

        // Load reservations
        const reservations = await fetch(`${API_URL}/reservations`)
            .then(res => res.json());

        tableBody.innerHTML = "";

        tables.forEach(table => {

            const booked = reservations.find(r =>

                Number(r.tableNumber) === table.tableNumber &&

                (

                    r.status === "Pending" ||

                    r.status === "Confirmed"

                )

            );

            tableBody.innerHTML += `

            <tr>

                <td>Table ${table.tableNumber}</td>

                <td>${table.seats}</td>

                <td>

                    <span style="font-weight:bold;
                                 color:${booked ? "#dc2626" : "#16a34a"}">

                        ${booked ? "Booked" : "Available"}

                    </span>

                </td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}

// ======================================
// AUTO REFRESH DASHBOARD
// ======================================

setInterval(() => {

    if (document.getElementById("totalUsers")) {

        loadDashboard();

    }

}, 30000);


// ======================================
// PAGE AUTO LOAD
// ======================================

window.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("customerTable")) {

        loadCustomers();

    }

    if (document.getElementById("reservationTableBody")) {

        loadReservations();

    }

    if (document.getElementById("todayReservationTableBody")) {

        loadTodayReservations();

    }

    if (document.getElementById("upcomingReservationTableBody")) {

        loadUpcomingReservations();

    }

    if (document.getElementById("tableBody")) {

        loadTables();

    }

    if (document.getElementById("totalUsers")) {

        loadDashboard();

    }

});


