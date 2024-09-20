document.addEventListener("DOMContentLoaded", async function () {
    const username = localStorage.getItem("username"); // Retrieve username from local storage
    const authToken = localStorage.getItem("authToken"); // Retrieve authToken from local storage

    if (!authToken || !username) {
        // If no token or username, redirect to login page
        window.location.href = "login.html";
        return;
    }

    const customerApiUrl = `http://localhost:8081/api/v1/customer/${username}`;

    try {
        const response = await fetch(customerApiUrl, {
            method: "GET",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch customer details.");
        }

        const customer = await response.json();

        // Populate form fields with the customer data
        document.getElementById("full-name").value = customer.KH_Ten;
        document.getElementById("address").value = customer.KH_DiaChi;
        document.getElementById("username").value = customer.KH_TaiKhoan;
        document.getElementById("phone-number").value = customer.KH_SoDienThoai;

        // Mask the password field with asterisks
        document.getElementById("password").value = "*".repeat(8); // Replace 8 with the length of the password if needed

        // Update profile name and username
        document.getElementById("profile-name").innerText = customer.KH_Ten;
        document.getElementById(
            "profile-username"
        ).innerText = `@ ${customer.KH_TaiKhoan}`;
    } catch (err) {
        console.error("Error fetching customer data:", err);
    }
});
