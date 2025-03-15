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

async function fetchRecentUpdates() {
  try {
      const token = localStorage.getItem("authToken");

      // Gọi API lấy danh sách khách hàng
      const customersResponse = await fetch("http://localhost:8081/api/v1/customer", {
          method: "GET",
          headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
          },
      });

      if (!customersResponse.ok) {
          throw new Error(`Lỗi API customers: ${customersResponse.status} ${customersResponse.statusText}`);
      }

      const customersText = await customersResponse.text();
      if (!customersText) {
          throw new Error("API customers trả về phản hồi rỗng");
      }

      const customers = JSON.parse(customersText);

      if (!Array.isArray(customers)) {
          throw new Error("API customers không trả về danh sách hợp lệ");
      }

      // Chuyển đổi dữ liệu khách hàng mới tạo
      const customerUpdates = customers.map(customer => ({
          type: "customer",
          name: customer.KH_Ten,
          message: `đã tạo tài khoản.`,
          date: new Date(customer.KH_NgayTao),
      }));

      // Gọi API lấy danh sách đơn hàng
      const ordersResponse = await fetch("http://localhost:8081/api/v1/orders", {
          method: "GET",
          headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
          },
      });

      if (!ordersResponse.ok) {
          throw new Error(`Lỗi API orders: ${ordersResponse.status} ${ordersResponse.statusText}`);
      }

      const ordersText = await ordersResponse.text();
      if (!ordersText) {
          throw new Error("API orders trả về phản hồi rỗng");
      }

      const orders = JSON.parse(ordersText);

      if (!Array.isArray(orders)) {
          throw new Error("API orders không trả về danh sách hợp lệ");
      }

      // Lấy danh sách KH_Ma từ đơn hàng (lọc trùng)
      const customerIds = [...new Set(orders.map(order => order.KH_Ma))];

      let customerMap = {}; // Lưu KH_Ten theo KH_Ma

      // Gọi API lấy tên khách hàng theo từng KH_Ma
      await Promise.all(customerIds.map(async (customerId) => {
          const customerResponse = await fetch(`http://localhost:8081/api/v1/customer/${customerId}`, {
              method: "GET",
              headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json",
              },
          });

          if (customerResponse.ok) {
              const customerText = await customerResponse.text(); // Kiểm tra JSON rỗng
              if (customerText) {
                  const customerData = JSON.parse(customerText);
                  customerMap[customerId] = customerData.KH_Ten;
              } else {
                  console.warn(`API customer/${customerId} trả về rỗng`);
              }
          } else {
              console.warn(`Lỗi khi lấy khách hàng ${customerId}: ${customerResponse.status}`);
          }
      }));

      // Chuyển đổi dữ liệu đơn hàng
      const orderUpdates = orders.map(order => ({
          type: "order",
          name: customerMap[order.KH_Ma] || "Khách hàng không xác định",
          message: `đã đặt một đơn hàng trị giá $${order.TongTien.toLocaleString()}.`,
          date: new Date(order.NgayTao),
      }));

      // Gộp cả hai danh sách và sắp xếp theo thời gian gần nhất
      const allUpdates = [...customerUpdates, ...orderUpdates].sort((a, b) => b.date - a.date);

      // Cập nhật UI
      const updatesContainer = document.querySelector(".updates");
      updatesContainer.innerHTML = ""; // Xóa nội dung cũ

      allUpdates.forEach(update => {
          const updateElement = document.createElement("div");
          updateElement.classList.add("update");

          updateElement.innerHTML = `
              <div class="profile-photo"></div>
              <div class="message">
                  <p><b>${update.name}</b> ${update.message}</p>
                  <small class="text-muted">${timeAgo(update.date)}</small>
              </div>
          `;

          updatesContainer.appendChild(updateElement);
      });

  } catch (error) {
      console.error("Lỗi khi lấy Recent Updates:", error);
  }
}

// Hàm hiển thị thời gian tương đối (ví dụ: "2 phút trước", "1 giờ trước")
function timeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return `${seconds} giây trước`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

// Gọi hàm khi trang tải xong
document.addEventListener("DOMContentLoaded", fetchRecentUpdates);

