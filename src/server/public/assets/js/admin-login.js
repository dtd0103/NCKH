function base64Decode(str) {
    return decodeURIComponent(escape(atob(str)));
}

function decodeJWT(token) {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Invalid JWT format");
    const header = JSON.parse(base64Decode(parts[0]));
    const payload = JSON.parse(base64Decode(parts[1]));
    return { header, payload };
}

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/v1/employee/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }

        const data = await response.json();
        console.log(data.message);
        localStorage.setItem("authToken", data.token);
        console.log(data.token)
        const decoded = decodeJWT(data.token);
        console.log(decoded);
        console.log(decoded.payload.username);
        localStorage.setItem("username", decoded.payload.username);
        sessionStorage.removeItem("anonymousUserId");
        window.location.href = "admin.html";
    } catch (error) {
        console.error("Đăng nhập thất bại:", error.message);
    }
});

function checkLoggedIn() {
    const token = localStorage.getItem("authToken");

    if (token) {
        window.location.href = "index.html";
    }
}

window.addEventListener("DOMContentLoaded", checkLoggedIn);
