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

    // Populate form fields with the customer data
    document.getElementById("full-name").value = customer.KH_Ten;
    document.getElementById("address").value = customer.KH_DiaChi;
    document.getElementById("username").value = customer.KH_TaiKhoan;
    document.getElementById("phone-number").value = customer.KH_SoDienThoai;

    const passwordInput = document.getElementById("password");
    const newPasswordInput = document.getElementById("new-password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const saveButton = document.querySelector("button[type='submit']");
    const errorMessages = document.querySelectorAll(".form__error");

    // Mask the password field with asterisks
    passwordInput.value = "*".repeat(8); // Replace 8 with the length of the password if needed

    // Update profile name and username
    document.getElementById("profile-name").innerText = customer.KH_Ten;
    document.getElementById(
      "profile-username"
    ).innerText = `@ ${customer.KH_TaiKhoan}`;

    function validatePassword() {
      const currentPassword = customer.KH_MatKhau; // Password from API (assumed it's part of the customer object)
      const enteredPassword = passwordInput.value;
      const newPassword = newPasswordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      // Reset all error messages
      errorMessages.forEach((msg) => (msg.style.display = "none"));

      let valid = true; // Flag to track validation status

      // Validate current password
      if (enteredPassword !== currentPassword) {
        errorMessages[0].innerText = "Mật khẩu cũ không chính xác";
        errorMessages[0].style.display = "block";
        valid = false; // Set valid to false if there's an error
      }

      // Validate new password
      if (newPassword === enteredPassword) {
        errorMessages[1].innerText =
          "Mật khẩu mới không được trùng với mật khẩu cũ";
        errorMessages[1].style.display = "block";
        valid = false; // Set valid to false if there's an error
      }

      // Validate confirm password
      if (newPassword !== confirmPassword) {
        errorMessages[2].innerText = "Mật khẩu nhập lại không khớp";
        errorMessages[2].style.display = "block";
        valid = false; // Set valid to false if there's an error
      }

      // If all validations pass
      return valid;
    }

    // Enable or disable the save button based on password validation
    function toggleSaveButton() {
      saveButton.disabled = !validatePassword();
    }

    // Attach event listeners for password validation
    newPasswordInput.addEventListener("input", toggleSaveButton);
    confirmPasswordInput.addEventListener("input", toggleSaveButton);
    passwordInput.addEventListener("input", toggleSaveButton);
  } catch (err) {
    console.error("Error fetching customer data:", err);
  }
});
