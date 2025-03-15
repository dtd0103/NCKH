// Khai báo các phần tử DOM
const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");
const brandTable = document.querySelector("#brandTable tbody");
const addBrandForm = document.getElementById("addBrandForm");
const pageNumbers = document.getElementById("pageNumbers");
const token = localStorage.getItem("authToken");
const rowsPerPage = 5; // Số dòng hiển thị trên mỗi trang
let currentPage = 1; // Trang hiện tại
let brands = []; // Lưu trữ dữ liệu thương hiệu

// Hiển thị sidebar khi nhấn nút menu
menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

// Đóng sidebar khi nhấn nút close
closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

// Thay đổi giao diện (theme)
themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme-variables");
  themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
  themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
});

// Hiển thị danh sách thương hiệu
async function fetchBrands() {
  try {
    const response = await fetch("http://localhost:8081/api/v1/brands");
    if (!response.ok) {
      throw new Error("Không thể tải dữ liệu thương hiệu");
    }
    brands = await response.json();
    renderTable(paginateData(currentPage));
    updatePagination();
  } catch (error) {
    console.error("Error fetching brands:", error);
  }
}

function paginateData(page) {
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  return brands.slice(startIndex, endIndex);
}

function updatePagination() {
  const totalPages = Math.ceil(brands.length / rowsPerPage);
  pageNumbers.innerHTML = `Trang ${currentPage} trên ${totalPages}`;
}

// Chuyển về trang trước
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable(paginateData(currentPage));
    updatePagination();
  }
});

// Chuyển về trang kế tiếp
document.getElementById("nextPage").addEventListener("click", () => {
  const totalPages = Math.ceil(brands.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable(paginateData(currentPage));
    updatePagination();
  }
});

// Thêm thương hiệu
addBrandForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const brandName = document.getElementById("brandName").value;
  const brandImage = document.getElementById("brandImage").files[0];

  const formData = new FormData();
  formData.append("name", brandName);
  formData.append("image", brandImage);

  try {
    const response = await fetch("http://localhost:8081/api/v1/brand", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Không thể thêm thương hiệu");
    }

    alert("Thêm thương hiệu thành công!");
    fetchBrands();
    addBrandForm.reset();
  } catch (error) {
    console.error("Error adding brand:", error);
  }
});
function renderTable(data) {
  brandTable.innerHTML = "";
  data.forEach((brand) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${brand.TH_Ma}</td>
      <td>${brand.TH_Ten}</td>
      <td><img src="images/brands/${brand.TH_HinhAnh}" alt="${brand.TH_Ten}" width="50" height="50"></td>
      <td>
        <button class="edit-btn" data-id="${brand.TH_Ma}">Chỉnh sửa</button>
        <button class="delete-btn" data-id="${brand.TH_Ma}">Xóa</button>
      </td>
    `;
    brandTable.appendChild(row);
  });

  // Add event listeners to buttons
 // Gắn sự kiện cho nút chỉnh sửa
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => editBrand(btn.dataset.id));
  });

  // Gắn sự kiện cho nút xóa
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteBrand(btn.dataset.id));
  });
}

// Cập nhật thông tin thương hiệu
async function editBrand(brandId) {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(`http://localhost:8081/api/v1/brand/${brandId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Không thể tải thông tin thương hiệu.");
    }

    const brand = await response.json();

    document.getElementById("editBrandName").value = brand.TH_Ten;
   

    document.getElementById("editBrandOverlay").style.display = "flex";

    const editBrandForm = document.getElementById("editBrandForm");
    editBrandForm.onsubmit = async (event) => {
      event.preventDefault();

      const updatedBrand = new FormData();
      updatedBrand.append("name", document.getElementById("editBrandName").value);

      const newImage = document.getElementById("editBrandImage").files[0];
      if (newImage) {
        updatedBrand.append("image", newImage);
      }

      try {
        const updateResponse = await fetch(
          `http://localhost:8081/api/v1/brand/${brandId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: updatedBrand,
          }
        );

        if (!updateResponse.ok) {
          throw new Error(await updateResponse.text());
        }

        alert("Cập nhật thông tin thương hiệu thành công!");
        fetchBrands();
        document.getElementById("editBrandOverlay").style.display = "none";
      } catch (error) {
        console.error("Lỗi cập nhật thương hiệu: ", error.message);
        alert("Không thể cập nhật thương hiệu: " + error.message);
      }
    };

    document.getElementById("closeEditOverlay").onclick = () => {
      document.getElementById("editBrandOverlay").style.display = "none";
    };
  } catch (error) {
    console.error("Lỗi khi lấy thông tin thương hiệu: ", error.message);
    alert("Không thể tải thông tin thương hiệu.");
  }
}

// Thêm sự kiện cho nút đóng overlay
document.getElementById("closeEditOverlay").addEventListener("click", () => {
  document.getElementById("editBrandOverlay").style.display = "none";
});


// Xóa thương hiệu
async function deleteBrand(brandId) {
  if (confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
    try {
      const response = await fetch(
        `http://localhost:8081/api/v1/brand/${brandId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể xóa thương hiệu");
      }

      alert("Xóa thương hiệu thành công!");
      fetchBrands();
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("Lỗi: " + error.message);
    }
  }
}

// Khởi chạy ứng dụng
window.onload = fetchBrands;
