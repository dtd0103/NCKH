const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");

//show sidebar
menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

//close sidebar
closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

//change theme
themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme-variables");

  themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
  themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
});

// Lấy tất cả khách hàng và hiển thị trên trang
const fetchAllCustomers = async () => {
  try {
    const response = await fetch("http://localhost:8081/api/v1/customer");
    const customers = await response.json();

    // Gọi hàm render để hiển thị dữ liệu
    renderCustomers(customers);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin khách hàng:", error);
  }
};
const renderCustomers = (customers) => {
  const customerListContainer = document.getElementById("customer-list");

  // Thêm kiểm tra
  if (!customerListContainer) {
    console.error('Không tìm thấy element với id "customer-list"');
    return;
  }

  // Xóa nội dung cũ
  customerListContainer.innerHTML = "";

  customers.forEach((customer) => {
    const customerItem = document.createElement("div");
    customerItem.className = "customer-item";
    customerItem.innerHTML = `
            <p><strong>ID:</strong> ${customer.id}</p>
            <p><strong>Name:</strong> ${customer.name}</p>
            <p><strong>Username:</strong> ${customer.username}</p>
            <p><strong>Phone:</strong> ${customer.phone}</p>
            <p><strong>Address:</strong> ${customer.address}</p>
            <hr />
        `;
    customerListContainer.appendChild(customerItem);
  });
};

// Gọi hàm khi tải trang
document.addEventListener("DOMContentLoaded", () => {
  fetchAllCustomers();
});
const updateCustomer = async (customerData) => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch("http://localhost:8081/api/v1/customer", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(customerData),
    });

    // Thêm kiểm tra status code
    if (response.status === 403) {
      throw new Error("Không có quyền truy cập. Vui lòng đăng nhập lại.");
    }
    if (!response.ok) {
      throw new Error("Lỗi server: " + response.status);
    }

    const result = await response.json();
    console.log("Cập nhật thành công:", result);
  } catch (error) {
    console.error("Lỗi cập nhật:", error.message);
  }
};

// Ví dụ sử dụng
const updatedCustomer = {
  id: "5",
  name: "Dat",
  username: "dat01",
  password: "$2b$10$xMDLe0OJQ1Db/dYkBwNwr.fTUyVuDstNrDYkXXqhAKX...",
  phone: "012898149",
  address: "Can Tho",
};
updateCustomer(updatedCustomer);

const deleteCustomer = async (customerId) => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `http://localhost:8081/api/v1/customer/${customerId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 403) {
      throw new Error("Không có quyền xóa. Vui lòng đăng nhập lại.");
    }
    if (!response.ok) {
      throw new Error("Lỗi server: " + response.status);
    }

    console.log("Xóa khách hàng thành công");
  } catch (error) {
    console.error("Lỗi khi xóa:", error.message);
  }
};

// Ví dụ sử dụng
deleteCustomer(1); // ID của khách hàng cần xóa
