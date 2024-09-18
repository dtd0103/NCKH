const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(
            "http://localhost:8081/api/v1/customer/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            }
        );

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }

        const data = await response.json();
        console.log(data.message);
        localStorage.setItem("authToken", data.token);

        window.location.href = "index.html";
    } catch (error) {
        console.error("Đăng nhập thất bại:", error.message);
    }
});
