// ======================================
// API URL
// ======================================

const API_URL = "http://localhost:5000";


// ======================================
// FORGOT PASSWORD
// ======================================

const forgotPasswordForm = document.getElementById("forgotPasswordForm");

if (forgotPasswordForm) {

    forgotPasswordForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        // ==============================
        // Get Form Values
        // ==============================

        const username = document.getElementById("username").value.trim();

        const phone = document.getElementById("phone").value.trim();

        const newPassword = document.getElementById("newPassword").value.trim();

        const confirmPassword = document.getElementById("confirmPassword").value.trim();


        // ==============================
        // Password Match Validation
        // ==============================

        if (newPassword !== confirmPassword) {

            alert("Passwords do not match.");

            return;

        }


        try {

            const response = await fetch(`${API_URL}/users/forgot-password`, {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    username,
                    phone,
                    newPassword

                })

            });

            const data = await response.json();


            // ==============================
            // Success
            // ==============================

            if (response.ok) {

                alert(data.message);

                window.location.href = "login.html";

            }

            // ==============================
            // Error
            // ==============================

            else {

                alert(data.message);

            }

        }

        catch (error) {

            console.log(error);

            alert("Server Error");

        }

    });

}