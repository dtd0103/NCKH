async function fetchTotalRevenue() {
    try {
        const response = await fetch("http://localhost:8081/api/v1/orders", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}` // Nếu API yêu cầu JWT
            }
        });

        if (!response.ok) {
            throw new Error("Không thể lấy dữ liệu đơn hàng");
        }

        const orders = await response.json();

        // Lọc các đơn hàng có trạng thái "Đã xác nhận"
        const confirmedOrders = orders.filter(order => order.TrangThai === "Đã xác nhận");

        // Tính tổng doanh thu
        const totalRevenue = confirmedOrders.reduce((sum, order) => sum + order.TongTien, 0);

        // Cập nhật tổng doanh thu lên UI
        document.getElementById("totalRevenue").innerText = `$${totalRevenue.toLocaleString()}`;
    } catch (error) {
        console.error("Lỗi khi lấy tổng doanh thu:", error);
    }
}

// Gọi hàm khi trang tải xong
document.addEventListener("DOMContentLoaded", fetchTotalRevenue);


document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("http://localhost:8081/api/v1/orders", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}` // Nếu API yêu cầu JWT
            }
        });
        const orders = await response.json();

        // Tính tổng doanh thu từ các đơn hàng đã xác nhận
        const totalRevenue = orders.reduce((sum, order) => {
            return order.TrangThai === "Đã xác nhận" ? sum + order.TongTien : sum;
        }, 0);

        document.getElementById("totalRevenue").innerText = `$${totalRevenue.toLocaleString()}`;

        // Giả sử mục tiêu doanh thu là 10,000$
        const targetRevenue = 10000;
        const percentage = Math.min((totalRevenue / targetRevenue) * 100, 100);

        document.querySelector(".progress .number p").innerText = `${Math.round(percentage)}%`;

        // Cập nhật progress circle
        const circle = document.querySelector(".progress circle");
        const circumference = 2 * Math.PI * 36;
        circle.style.strokeDashoffset = circumference - (circumference * (percentage / 100));
        circle.style.stroke = "#58D68D"; // Màu xanh

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
});

async function fetchData(url, elementId) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}` 
            }
        });

        if (!response.ok) {
            throw new Error(`Không thể lấy dữ liệu từ ${url}`);
        }

        const data = await response.json();

        // Cập nhật số lượng lên UI
        document.getElementById(elementId).innerText = data.length.toLocaleString();
    } catch (error) {
        console.error(`Lỗi khi lấy dữ liệu từ ${url}:`, error);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    fetchData("http://localhost:8081/api/v1/orders", "totalOrders");
    fetchData("http://localhost:8081/api/v1/products", "totalProducts");
    fetchData("http://localhost:8081/api/v1/customer", "totalCustomers");
});
