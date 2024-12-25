const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");

// Show sidebar
menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

// Close sidebar
closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

// Change theme
themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme-variables");

  themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
  themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
});

// Format date function
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// Fetch customer data
async function fetchCustomers() {
  try {
    const response = await fetch("http://localhost:8081/api/v1/customer");
    if (!response.ok) {
      throw new Error("Lỗi khi lấy thông tin khách hàng");
    }

    const customers = await response.json();
    const tableBody = document.getElementById("customer-table-body");

    // Clear existing table rows
    tableBody.innerHTML = "";

    customers.forEach((customer) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                    <td>${customer.KH_Ma}</td>
                    <td>${customer.KH_Ten}</td>
                    <td>${customer.KH_TaiKhoan}</td>
                    <td>${customer.KH_SoDienThoai}</td>
                    <td>${customer.KH_DiaChi}</td>
                    <td>${formatDate(customer.KH_NgayTao)}</td>
                    <td><button class="delete-btn" data-id="${
                      customer.KH_Ma
                    }">Xóa</button></td>
                `;
      tableBody.appendChild(row);
    });

    // Add event listeners to delete buttons
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const customerId = button.getAttribute("data-id");
        await deleteCustomer(customerId);
      });
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    alert("Không thể lấy thông tin khách hàng. Vui lòng thử lại sau.");
  }
}

// Delete customer
async function deleteCustomer(customerId) {
  try {
    const token = localStorage.getItem("authToken"); // Ví dụ lấy token từ localStorage
    const response = await fetch(
      `http://localhost:8081/api/v1/customer/${customerId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Lỗi khi xóa khách hàng");
    }

    alert("Khách hàng đã được xóa.");
    fetchCustomers(); // Gọi lại hàm fetchCustomers để cập nhật bảng
  } catch (error) {
    console.error("Error deleting customer:", error);
    alert("Không thể xóa khách hàng. Vui lòng thử lại sau.");
  }
}
// Call fetchCustomers when the page is loaded
document.addEventListener("DOMContentLoaded", fetchCustomers);
