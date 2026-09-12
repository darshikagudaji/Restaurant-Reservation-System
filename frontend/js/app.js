console.log("app.js loaded");

// ==========================================
// API URL
// ==========================================

const API_URL = "http://localhost:5000";


// ==========================================
// RESTAURANT DETAILS
// ==========================================

const restaurantName = document.getElementById("restaurantName");

if (restaurantName) {

    fetch(`${API_URL}/restaurant`)
        .then(response => response.json())
        .then(data => {

            const restaurant = data[0];

            if (restaurant) {

                document.getElementById("restaurantName").innerText =
                    restaurant.restaurantName;

                document.getElementById("address").innerText =
                    restaurant.address;

                document.getElementById("phone").innerText =
                    restaurant.phone;

                document.getElementById("email").innerText =
                    restaurant.email;

                document.getElementById("openingTime").innerText =
                    restaurant.openingTime;

                document.getElementById("closingTime").innerText =
                    restaurant.closingTime;

            }

        })
        .catch(error => console.log(error));

}


// ==========================================
// LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const username =
            document.getElementById("loginUsername").value;

        const password =
            document.getElementById("loginPassword").value;

        try {

            const response = await fetch(
                `${API_URL}/users/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                localStorage.setItem(
                    "username",
                    data.user.username
                );

                localStorage.setItem(
                    "role",
                    data.user.role
                );

                showToast("Login Successful!");

                setTimeout(() => {

                    if (data.user.role === "admin") {

                        window.location.href =
                            "admin.html";

                    } else {

                        window.location.href =
                            "book-reservation.html";

                    }

                }, 1500);

            } else {

                showToast(data.message);

            }

        }

        catch (error) {

            console.log(error);

            showToast("Server Error");

        }

    });

}


// ==========================================
// CUSTOMER REGISTRATION
// ==========================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name =
            document.getElementById("name").value;

        const username =
            document.getElementById("username").value;

        const phone =
            document.getElementById("phone").value;

        const password =
            document.getElementById("password").value;

        try {

            const response = await fetch(
                `${API_URL}/users/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        username,
                        phone,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                registerForm.reset();

                showToast("Registration Successful!");

                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 2000);

            } else {

                showToast(data.message);

            }

        }

        catch (error) {

            console.log(error);

            showToast("Server Error");

        }

    });

}


// ==========================================
// LOAD TABLES BASED ON GUESTS
// ==========================================

const guestsInput =
    document.getElementById("guests");

const tableSelect =
    document.getElementById("tableNumber");

if (guestsInput && tableSelect) {

    guestsInput.addEventListener(
        "input",
        loadSuitableTables
    );

    guestsInput.addEventListener(
        "change",
        loadSuitableTables
    );

}


// ==========================================
// LOAD SUITABLE TABLES
// ==========================================

async function loadSuitableTables(
    selectedTable = null
) {

    if (!guestsInput || !tableSelect) return;

    const guests =
        Number(guestsInput.value);

    tableSelect.innerHTML =
        `<option value="">Select Suitable Table</option>`;

    if (!guests) return;

    try {

        const response =
            await fetch(`${API_URL}/tables`);

        const tables =
            await response.json();

        tables.forEach(table => {

            if (
                table.seats >= guests &&
                table.status === "Available"
            ) {

                tableSelect.innerHTML += `

                    <option value="${table.tableNumber}">
                        Table ${table.tableNumber}
                        (${table.seats} Seats)
                    </option>

                `;

            }

        });

        // ------------------------------------------
        // During rescheduling, keep the old table
        // if it is available and suitable.
        // ------------------------------------------

        if (selectedTable) {

            const oldTableOption =
                [...tableSelect.options].find(
                    option =>
                        option.value ==
                        selectedTable
                );

            if (oldTableOption) {

                tableSelect.value =
                    selectedTable;

            }

        }

    }

    catch (error) {

        console.log(error);

    }

}


// ==========================================
// RESERVATION / RESCHEDULE MODE
// ==========================================

const reservationForm =
    document.getElementById("reservationForm");

const reservationTitle =
    document.getElementById("reservationTitle");

const reservationSubmitBtn =
    document.getElementById("reservationSubmitBtn");

const cancelRescheduleBtn =
    document.getElementById("cancelRescheduleBtn");


// Get reservation ID from URL

const urlParams =
    new URLSearchParams(window.location.search);

const rescheduleId =
    urlParams.get("rescheduleId");


// ==========================================
// LOAD RESERVATION FOR RESCHEDULING
// ==========================================

async function loadReservationForReschedule() {

    if (!rescheduleId) return;

    try {

        const response =
            await fetch(
                `${API_URL}/reservations/mybookings/${
                    localStorage.getItem("username")
                }`
            );

        const reservations =
            await response.json();

        const reservation =
            reservations.find(
                item => item._id === rescheduleId
            );

        if (!reservation) {

            showToast(
                "Reservation not found."
            );

            return;

        }

        // ------------------------------------------
        // Fill existing information
        // ------------------------------------------

        document.getElementById(
            "customerName"
        ).value =
            reservation.customerName;

        document.getElementById(
            "phone"
        ).value =
            reservation.phone;

        document.getElementById(
            "guests"
        ).value =
            reservation.guests;

        document.getElementById(
            "reservationDate"
        ).value =
            reservation.reservationDate;

        document.getElementById(
            "reservationTime"
        ).value =
            reservation.reservationTime;


        // ------------------------------------------
        // Change page title
        // ------------------------------------------

        if (reservationTitle) {

            reservationTitle.innerText =
                "Reschedule Reservation";

        }


        // ------------------------------------------
        // Change button text
        // ------------------------------------------

        if (reservationSubmitBtn) {

            reservationSubmitBtn.innerText =
                "Update Reservation";

        }


        // ------------------------------------------
        // Show cancel reschedule button
        // ------------------------------------------

        if (cancelRescheduleBtn) {

            cancelRescheduleBtn.style.display =
                "block";

        }


        // ------------------------------------------
        // Load tables and keep old table selected
        // ------------------------------------------

        await loadSuitableTables(
            reservation.tableNumber
        );

    }

    catch (error) {

        console.log(error);

        showToast(
            "Unable to load reservation."
        );

    }

}


// ==========================================
// RESERVATION FORM
// ==========================================

if (reservationForm) {

    reservationForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const customerName =
                document.getElementById(
                    "customerName"
                ).value.trim();

            const phone =
                document.getElementById(
                    "phone"
                ).value.trim();

            const tableNumber =
                document.getElementById(
                    "tableNumber"
                ).value;

            const reservationDate =
                document.getElementById(
                    "reservationDate"
                ).value;

            const reservationTime =
                document.getElementById(
                    "reservationTime"
                ).value;

            const guests =
                document.getElementById(
                    "guests"
                ).value;

            const username =
                localStorage.getItem(
                    "username"
                );


            // ======================================
            // RESCHEDULE EXISTING RESERVATION
            // ======================================

            if (rescheduleId) {

                try {

                    const response =
                        await fetch(
                            `${API_URL}/reservations/reschedule/${rescheduleId}`,
                            {

                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    customerName,
                                    phone,
                                    tableNumber,
                                    reservationDate,
                                    reservationTime,
                                    guests

                                })

                            }
                        );

                    const data =
                        await response.json();

                    if (response.ok) {

                        showToast(
                            "Reservation Rescheduled Successfully!"
                        );

                        setTimeout(() => {

                            window.location.href =
                                "mybookings.html";

                        }, 1500);

                    }

                    else {

                        showToast(
                            data.message
                        );

                    }

                }

                catch (error) {

                    console.log(error);

                    showToast(
                        "Server Error"
                    );

                }

                return;

            }


            // ======================================
            // NORMAL NEW RESERVATION
            // ======================================

            try {

                const response =
                    await fetch(
                        `${API_URL}/reservations/book`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                customerName,
                                username,
                                phone,
                                tableNumber,
                                reservationDate,
                                reservationTime,
                                guests

                            })

                        }
                    );

                const data =
                    await response.json();

                if (response.ok) {

                    reservationForm.reset();

                    if (tableSelect) {

                        tableSelect.innerHTML =
                            `<option value="">
                                Select Suitable Table
                            </option>`;

                    }

                    showToast(
                        "Reservation Booked Successfully!"
                    );

                }

                else {

                    showToast(
                        data.message
                    );

                }

            }

            catch (error) {

                console.log(error);

                showToast(
                    "Server Error"
                );

            }

        }
    );

}


// ==========================================
// CANCEL RESCHEDULE
// ==========================================

if (cancelRescheduleBtn) {

    cancelRescheduleBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "mybookings.html";

        }
    );

}


// ==========================================
// TOAST MESSAGE
// ==========================================

function showToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast) return;

    toast.innerText =
        message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2000);

}


// ==========================================
// MY BOOKINGS
// ==========================================

const bookingTableBody =
    document.getElementById(
        "bookingTableBody"
    );

if (bookingTableBody) {

    loadMyBookings();

}


// ==========================================
// LOAD MY BOOKINGS
// ==========================================

async function loadMyBookings() {

    const username =
        localStorage.getItem(
            "username"
        );

    if (!username) {

        bookingTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="text-align:center;"
                >
                    Please login first.
                </td>

            </tr>

        `;

        return;

    }

    try {

        const response =
            await fetch(
                `${API_URL}/reservations/mybookings/${username}`
            );

        const reservations =
            await response.json();

        bookingTableBody.innerHTML =
            "";

        if (reservations.length === 0) {

            bookingTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="8"
                        style="text-align:center;"
                    >
                        No Reservations Found
                    </td>

                </tr>

            `;

            return;

        }


        reservations.forEach(
            reservation => {

                // --------------------------------------
                // RESCHEDULE + CANCEL
                // only Pending reservations
                // --------------------------------------

                let actionButtons = "";

                if (
                    reservation.status ===
                    "Pending"
                ) {

                    actionButtons = `

                        <button
                            class="rescheduleBtn"
                            data-id="${reservation._id}"
                        >
                            Reschedule
                        </button>

                        <button
                            class="cancelBtn"
                            data-id="${reservation._id}"
                        >
                            Cancel
                        </button>

                    `;

                }

                else {

                    actionButtons = `

                        <span
                            style="
                                color:gray;
                                font-weight:bold;
                            "
                        >
                            Not Allowed
                        </span>

                    `;

                }


                bookingTableBody.innerHTML += `

                    <tr>

                        <td>
                            ${reservation.customerName}
                        </td>

                        <td>
                            ${reservation.phone}
                        </td>

                        <td>
                            Table ${reservation.tableNumber}
                        </td>

                        <td>
                            ${reservation.reservationDate}
                        </td>

                        <td>
                            ${reservation.reservationTime}
                        </td>

                        <td>
                            ${reservation.guests}
                        </td>

                        <td>
                            ${reservation.status}
                        </td>

                        <td>
                            ${actionButtons}
                        </td>

                    </tr>

                `;

            }
        );

    }

    catch (error) {

        console.log(error);

        bookingTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="text-align:center;"
                >
                    Unable to load reservations.
                </td>

            </tr>

        `;

    }

}


// ==========================================
// MY BOOKINGS BUTTON ACTIONS
// ==========================================

if (bookingTableBody) {

    bookingTableBody.addEventListener(
        "click",
        async function (e) {


            // ======================================
            // RESCHEDULE
            // ======================================

            if (
                e.target.classList.contains(
                    "rescheduleBtn"
                )
            ) {

                const id =
                    e.target.dataset.id;

                window.location.href =
                    `book-reservation.html?rescheduleId=${id}`;

                return;

            }


            // ======================================
            // CANCEL
            // ======================================

            if (
                !e.target.classList.contains(
                    "cancelBtn"
                )
            ) {

                return;

            }


            const confirmCancel =
                confirm(
                    "Do you want to cancel this reservation?"
                );

            if (!confirmCancel) return;


            const id =
                e.target.dataset.id;


            try {

                const response =
                    await fetch(
                        `${API_URL}/reservations/cancel/${id}`,
                        {
                            method: "PUT"
                        }
                    );

                const data =
                    await response.json();


                if (response.ok) {

                    showToast(
                        data.message
                    );

                    setTimeout(() => {

                        loadMyBookings();

                    }, 1000);

                }

                else {

                    showToast(
                        data.message
                    );

                }

            }

            catch (error) {

                console.log(error);

                showToast(
                    "Server Error"
                );

            }

        }
    );

}


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function (e) {

            e.preventDefault();

            localStorage.clear();

            window.location.href =
                "index.html";

        }
    );

}


// ==========================================
// PAGE AUTO LOAD
// ==========================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        // --------------------------------------
        // Reservation Page
        // --------------------------------------

        if (
            document.getElementById(
                "guests"
            )
        ) {

            // If this is NOT reschedule mode,
            // load normal suitable tables.

            if (!rescheduleId) {

                loadSuitableTables();

            }

            else {

                // Load the existing reservation
                // information.

                loadReservationForReschedule();

            }

        }


        // --------------------------------------
        // My Bookings
        // --------------------------------------

        if (
            document.getElementById(
                "bookingTableBody"
            )
        ) {

            loadMyBookings();

        }

    }
);


// ==========================================
// END OF FILE
// ==========================================

console.log(
    "app.js loaded successfully."
);
