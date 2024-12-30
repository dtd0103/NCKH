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
    btn.addEventListener("click", () => editEmployee(btn.dataset.id))
  );

  deleteButtons.forEach((btn) =>
    btn.addEventListener("click", () => deleteEmployee(btn.dataset.id))
  );
}

async function editEmployee(employeeId) {
  const token = localStorage.getItem("authToken");

  // Mở form overlay để chỉnh sửa thông tin nhân viên
  // Lấy thông tin nhân viên từ API
  try {
    const response = await fetch(
      `http://localhost:8081/api/v1/employee/${employeeId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Không thể tải thông tin nhân viên.");
    }

    const employee = await response.json();

    // Điền dữ liệu vào form overlay
    document.getElementById("employeeID").value = employee.NV_Ma;
    document.getElementById("employeeName").value = employee.NV_Ten;
    document.getElementById("employeeUsername").value = employee.NV_TaiKhoan;
    document.getElementById("employeePhone").value = employee.NV_SoDienThoai;
    document.getElementById("employeeAddress").value = employee.NV_DiaChi;

    // Hiển thị overlay chỉnh sửa
    document.getElementById("editEmployeeOverlay").style.display = "block";

    // Xử lý sự kiện khi submit form chỉnh sửa
    const editEmployeeForm = document.getElementById("editEmployeeForm");
    editEmployeeForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const id = document.getElementById("employeeID").value;
      const name = document.getElementById("employeeName").value;
      const username = document.getElementById("employeeUsername").value;
      const phone = document.getElementById("employeePhone").value;
      const address = document.getElementById("employeeAddress").value;

      const updatedEmployee = { id, name, username, phone, address };

      try {
        const updateResponse = await fetch(
          `http://localhost:8081/api/v1/employee`,
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

        alert("Chỉnh sửa nhân viên thành công!");
        fetchEmployees(); // Tải lại danh sách nhân viên
        document.getElementById("editEmployeeOverlay").style.display = "none"; // Đóng overlay
      } catch (error) {
        console.error("Lỗi khi chỉnh sửa nhân viên: ", error.message);
        alert("Không thể chỉnh sửa nhân viên: " + error.message);
      }
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin nhân viên: ", error.message);
    alert("Lỗi khi lấy thông tin nhân viên: " + error.message);
  }
}



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
