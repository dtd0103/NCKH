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

document.addEventListener("DOMContentLoaded", () => {
  fetchEmployees();
  const token = localStorage.getItem("authToken");
  const addEmployeeForm = document.getElementById("addEmployeeForm");
  addEmployeeForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Ngăn trang load lại khi submit

    const name = document.getElementById("employeeName").value;
    const username = document.getElementById("employeeUsername").value;
    const password = document.getElementById("employeePassword").value;
    const phone = document.getElementById("employeePhone").value;
    const address = document.getElementById("employeeAddress").value;

    const newEmployee = { name, username, password, phone, address };

    try {
      const response = await fetch("http://localhost:8081/api/v1/employee", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      alert("Thêm nhân viên thành công!");
      addEmployeeForm.reset();
      fetchEmployees(); // Tải lại danh sách nhân viên
    } catch (error) {
      console.error("Lỗi thêm nhân viên: ", error.message);
      alert("Không thể thêm nhân viên: " + error.message);
    }
  });
});

async function fetchEmployees() {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch("http://localhost:8081/api/v1/employees");
    if (!response.ok) {
      throw new Error("Không thể tải dữ liệu nhân viên.");
    }
    const employees = await response.json();
    displayEmployees(employees);
  } catch (error) {
    console.error("Lỗi: ", error.message);
  }
}

function displayEmployees(employees) {
  const tableBody = document.querySelector("#employeeTable tbody");
  tableBody.innerHTML = "";

  employees.forEach((employee) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${employee.NV_Ma}</td>
      <td>${employee.NV_Ten}</td>
      <td>${employee.NV_TaiKhoan}</td>
      <td>${employee.NV_SoDienThoai}</td>
      <td>${employee.NV_DiaChi}</td>
      <td>
        <button class="edit-btn" data-id="${employee.NV_Ma}">Chỉnh sửa</button>
        <button class="delete-btn" data-id="${employee.NV_Ma}">Xóa</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Gắn sự kiện cho nút chỉnh sửa và xóa
  const editButtons = document.querySelectorAll(".edit-btn");
  const deleteButtons = document.querySelectorAll(".delete-btn");

  editButtons.forEach((btn) =>
    btn.addEventListener("click", () => updateEmployee(btn.dataset.id))
  );

  deleteButtons.forEach((btn) =>
    btn.addEventListener("click", () => deleteEmployee(btn.dataset.id))
  );
}

async function updateEmployee(employeeId) {
  const token = localStorage.getItem("authToken");

  try {
    // Lấy thông tin nhân viên từ backend
    const response = await fetch(
      `http://localhost:8081/api/v1/employee/${employeeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Không thể tải thông tin nhân viên.");
    }

    const employee = await response.json();

    // Điền dữ liệu vào form
    document.getElementById("editEmployeeName").value = employee.NV_Ten;
    document.getElementById("editEmployeeUsername").value =
      employee.NV_TaiKhoan;
    document.getElementById("editEmployeePhone").value =
      employee.NV_SoDienThoai;
    document.getElementById("editEmployeeAddress").value = employee.NV_DiaChi;

    // Hiển thị form overlay
    document.getElementById("editEmployeeOverlay").style.display = "flex";

    // Thêm sự kiện submit form để cập nhật thông tin nhân viên
    const editEmployeeForm = document.getElementById("editEmployeeForm");
    editEmployeeForm.onsubmit = async (event) => {
      event.preventDefault();

      const updatedEmployee = {
        id: employeeId,
        name: document.getElementById("editEmployeeName").value,
        username: document.getElementById("editEmployeeUsername").value,
        phone: document.getElementById("editEmployeePhone").value,
        address: document.getElementById("editEmployeeAddress").value,
      };

      try {
        const updateResponse = await fetch(
          "http://localhost:8081/api/v1/employee",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedEmployee),
          }
        );

        if (!updateResponse.ok) {
          throw new Error(await updateResponse.text());
        }

        alert("Cập nhật thông tin nhân viên thành công!");
        fetchEmployees(); // Tải lại danh sách nhân viên
        document.getElementById("editEmployeeOverlay").style.display = "none"; // Đóng overlay
      } catch (error) {
        console.error("Lỗi cập nhật nhân viên: ", error.message);
        alert("Không thể cập nhật nhân viên: " + error.message);
      }
    };

    // Đóng form overlay khi nhấn vào nút "Đóng"
    document.getElementById("closeEditOverlay").onclick = () => {
      document.getElementById("editEmployeeOverlay").style.display = "none";
    };
  } catch (error) {
    console.error("Lỗi khi lấy thông tin nhân viên: ", error.message);
    alert("Không thể tải thông tin nhân viên.");
  }
}
const editButtons = document.querySelectorAll(".edit-btn");
editButtons.forEach((btn) =>
  btn.addEventListener("click", () => updateEmployee(btn.dataset.id))
);


async function deleteEmployee(employeeId) {
  const token = localStorage.getItem("authToken");

  const confirmDelete = confirm("Bạn có chắc chắn muốn xóa nhân viên này?");
  if (!confirmDelete) {
    return; // Người dùng chọn không xóa
  }

  try {
    const response = await fetch(
      `http://localhost:8081/api/v1/employee/${employeeId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    alert("Xóa nhân viên thành công!");
    fetchEmployees(); // Tải lại danh sách nhân viên sau khi xóa
  } catch (error) {
    console.error("Lỗi khi xóa nhân viên: ", error.message);
    alert("Không thể xóa nhân viên: " + error.message);
  }
}
