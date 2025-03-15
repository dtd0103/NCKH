const categoryTable = document.querySelector("#categoryTable tbody");
const addCategoryForm = document.getElementById("addCategoryForm");
const categoryPageNumbers = document.getElementById("pageNumbers");
const token = localStorage.getItem("authToken");

const rowsPerPage = 5;
let currentCategoryPage = 1;
let categories = [];

// 🛒 Lấy danh sách danh mục từ API
async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:8081/api/v1/categories");
    if (!response.ok) {
      throw new Error("Không thể tải dữ liệu danh mục");
    }
    categories = await response.json();
    renderCategoryTable(paginateCategoryData(currentCategoryPage));
    updateCategoryPagination();
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

// 📌 Chia dữ liệu theo trang
function paginateCategoryData(page) {
  const startIndex = (page - 1) * rowsPerPage;
  return categories.slice(startIndex, startIndex + rowsPerPage);
}

// 🔢 Cập nhật số trang
function updateCategoryPagination() {
  const totalPages = Math.ceil(categories.length / rowsPerPage);
  categoryPageNumbers.innerHTML = `Trang ${currentCategoryPage} trên ${totalPages}`;
}

// ⬅️ Chuyển về trang trước
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentCategoryPage > 1) {
    currentCategoryPage--;
    renderCategoryTable(paginateCategoryData(currentCategoryPage));
    updateCategoryPagination();
  }
});

// ➡️ Chuyển về trang kế tiếp
document.getElementById("nextPage").addEventListener("click", () => {
  const totalPages = Math.ceil(categories.length / rowsPerPage);
  if (currentCategoryPage < totalPages) {
    currentCategoryPage++;
    renderCategoryTable(paginateCategoryData(currentCategoryPage));
    updateCategoryPagination();
  }
});

// 📌 Hiển thị dữ liệu danh mục trên bảng
function renderCategoryTable(data) {
  categoryTable.innerHTML = "";
  data.forEach((category) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${category.DM_Ma}</td>
      <td>${category.DM_Ten}</td>
      <td><img src="images/categories/${category.DM_HinhAnh}" alt="${category.DM_Ten}" width="50" height="50"></td>
      <td>
        <button class="edit-category-btn" data-id="${category.DM_Ma}">Chỉnh sửa</button>
        <button class="delete-category-btn" data-id="${category.DM_Ma}">Xóa</button>
      </td>
    `;
    categoryTable.appendChild(row);
  });

  // Gắn sự kiện chỉnh sửa
  document.querySelectorAll(".edit-category-btn").forEach((btn) => {
    btn.addEventListener("click", () => editCategory(btn.dataset.id));
  });

  // Gắn sự kiện xóa
  document.querySelectorAll(".delete-category-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteCategory(btn.dataset.id));
  });
}

// 🛒 Thêm danh mục
addCategoryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const categoryName = document.getElementById("categoryName").value;
  const categoryImage = document.getElementById("categoryImage").files[0];

  const formData = new FormData();
  formData.append("name", categoryName);
  formData.append("image", categoryImage);

  try {
    const response = await fetch("http://localhost:8081/api/v1/category", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Không thể thêm danh mục");
    }

    alert("Thêm danh mục thành công!");
    fetchCategories();
    addCategoryForm.reset();
  } catch (error) {
    console.error("Error adding category:", error);
  }
});

async function editCategory(categoryId) {
  try {
      // 🔹 Lấy thông tin danh mục hiện tại
      const response = await fetch(`http://localhost:8081/api/v1/category/${categoryId}`, {
          headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
          throw new Error("Không thể tải thông tin danh mục.");
      }

      const category = await response.json();
      document.getElementById("editCategoryName").value = category.DM_Ten;
      document.getElementById("editCategoryOverlay").style.display = "flex";

      // 🔹 Xử lý khi nhấn "Lưu thay đổi"
      document.getElementById("editCategoryForm").onsubmit = async (event) => {
          event.preventDefault();

          const formData = new FormData();
          formData.append("DM_Ten", document.getElementById("editCategoryName").value);

          const imageInput = document.getElementById("editCategoryImage");
          if (imageInput.files.length > 0) {
              formData.append("image", imageInput.files[0]); // Chỉ thêm file nếu có
          }

          try {
              const updateResponse = await fetch(`http://localhost:8081/api/v1/category/${categoryId}`, {
                  method: "PUT",
                  headers: { Authorization: `Bearer ${token}` }, // Không đặt Content-Type ở đây!
                  body: formData, // Sử dụng FormData để gửi ảnh và dữ liệu
              });

              if (!updateResponse.ok) {
                  const errorText = await updateResponse.text();
                  throw new Error("Lỗi từ API: " + errorText);
              }

              alert("Cập nhật danh mục thành công!");
              fetchCategories(); // Load lại danh sách danh mục
              document.getElementById("editCategoryOverlay").style.display = "none"; // Ẩn modal
          } catch (error) {
              alert("Không thể cập nhật danh mục: " + error.message);
          }
      };

      // 🔹 Xử lý khi nhấn "Hủy"
      document.getElementById("closeEditCategoryOverlay").onclick = () => {
          document.getElementById("editCategoryOverlay").style.display = "none";
      };
  } catch (error) {
      alert("Không thể tải thông tin danh mục: " + error.message);
  }
}


// 🛠 Chỉnh sửa danh mục
// async function editCategory(categoryId) {
//   try {
//     const response = await fetch(`http://localhost:8081/api/v1/category/${categoryId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (!response.ok) {
//       throw new Error("Không thể tải thông tin danh mục.");
//     }

//     const category = await response.json();
//     document.getElementById("editCategoryName").value = category.DM_Ten;
//     document.getElementById("editCategoryOverlay").style.display = "flex";

//     document.getElementById("editCategoryForm").onsubmit = async (event) => {
//       event.preventDefault();

//       const updatedCategory = {
//         DM_Ten: document.getElementById("editCategoryName").value,
//       };

//       console.log("Dữ liệu gửi đi:", updatedCategory); // Kiểm tra dữ liệu trước khi gửi

//       try {
//         const updateResponse = await fetch(`http://localhost:8081/api/v1/category/${categoryId}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(updatedCategory),
//         });

//         if (!updateResponse.ok) {
//           const errorText = await updateResponse.text();
//           throw new Error("Lỗi từ API: " + errorText);
//         }

//         alert("Cập nhật danh mục thành công!");
//         fetchCategories();
//         document.getElementById("editCategoryOverlay").style.display = "none";
//       } catch (error) {
//         alert("Không thể cập nhật danh mục: " + error.message);
//       }
//     };

//     document.getElementById("closeEditCategoryOverlay").onclick = () => {
//       document.getElementById("editCategoryOverlay").style.display = "none";
//     };
//   } catch (error) {
//     alert("Không thể tải thông tin danh mục: " + error.message);
//   }
// }


// 🗑 Xóa danh mục
async function deleteCategory(categoryId) {
  if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
    try {
      const response = await fetch(
        `http://localhost:8081/api/v1/category/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể xóa danh mục");
      }

      alert("Xóa danh mục thành công!");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Lỗi: " + error.message);
    }
  }
}

// 🏁 Khởi chạy
window.onload = fetchCategories;

