document.addEventListener("DOMContentLoaded", () => {
  fetchEmployees();

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
        <button class="edit-btn" onclick="editEmployee(${employee.NV_Ma})">Sửa</button>
        <button class="delete-btn" onclick="deleteEmployee(${employee.NV_Ma})">Xóa</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}
