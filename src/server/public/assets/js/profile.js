document.addEventListener("DOMContentLoaded", async function () {
    const username = localStorage.getItem("username"); // Retrieve username from local storage
    const authToken = localStorage.getItem("authToken"); // Retrieve authToken from local storage

    if (!authToken || !username) {
        // If no token or username, redirect to login page
        window.location.href = "login.html";
        return;
    }

    const customerApiUrl = `/api/v1/customer/${username}`;

    try {
        const response = await fetch(customerApiUrl, {
            method: "GET",
            
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch customer details.");
        }

        const customer = await response.json();

        // Update name in HTML
        const nameElement = document.getElementById("customerName");
        nameElement.textContent = customer.KH_Ten;

        // Update phone number in HTML
        const phoneElement = document.getElementById("customerPhone");
        phoneElement.textContent = `+84 ${customer.KH_SoDienThoai}`;

        // Update address in HTML
        const addressElement = document.getElementById("customerAddress");
        addressElement.textContent = customer.KH_DiaChi;

        // Update username in HTML
        const usernameElement = document.getElementById("customerUsername");
        usernameElement.textContent = "@"+customer.KH_TaiKhoan;
    } catch (err) {
        console.error("Error fetching customer data:", err);
    }
});
