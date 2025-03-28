const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(registerForm);
    const formDataObject = {};

    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    try {
        const response = await fetch("/api/v1/customer/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formDataObject),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log(data);

        window.location.href = "./index.html";
    } catch (error) {
        console.error("Đăng ký thất bại:", error.message);
    }
});

function checkLoggedIn() {
    const token = localStorage.getItem("authToken");

    if (token) {
        window.location.href = "index.html";
    }
}

window.addEventListener("DOMContentLoaded", checkLoggedIn);
