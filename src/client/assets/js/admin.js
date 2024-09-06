// Utility function to load data from localStorage
function loadData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Utility function to save data to localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Xác Thực Admin
const loginForm = document.getElementById('login-form');
const adminMain = document.getElementById('admin-main');
const loginSection = document.getElementById('login-section');

// Đặt thông tin đăng nhập mặc định (trong thực tế, nên để backend quản lý)
const admin = {
    username: 'admin',
    password: 'admin123'
};

// Kiểm tra xem admin đã đăng nhập chưa
function checkLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        loginSection.style.display = 'none';
        adminMain.style.display = 'block';
    }
}

// Gọi hàm kiểm tra đăng nhập khi tải trang
checkLogin();

// Xử lý đăng nhập
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();

    if (username === admin.username && password === admin.password) {
        // Đăng nhập thành công
        localStorage.setItem('isLoggedIn', 'true');
        loginSection.style.display = 'none';
        adminMain.style.display = 'block';
    } else {
        // Thông báo đăng nhập thất bại
        alert('Tên đăng nhập hoặc mật khẩu không chính xác!');
    }
});

// Xử lý đăng xuất
function logout() {
    localStorage.removeItem('isLoggedIn');
    loginSection.style.display = 'block';
    adminMain.style.display = 'none';
}

// ========================================
// Quản Lý Danh Mục
// ========================================
const categoryForm = document.getElementById('category-form');
const categoryList = document.getElementById('category-list');
const productCategorySelect = document.getElementById('product-category');

// Load categories from localStorage
let categories = loadData('categories');
renderCategories();

// Populate category dropdown in product form
function populateCategoryDropdown() {
    productCategorySelect.innerHTML = '<option value="">Chọn Danh Mục</option>';
    categories.forEach((category, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = category.name;
        productCategorySelect.appendChild(option);
    });
}

populateCategoryDropdown();

// Handle category form submission
categoryForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const categoryName = document.getElementById('category-name').value.trim();
    const categoryImage = document.getElementById('category-image').files[0];

    if (categoryName && categoryImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newCategory = {
                name: categoryName,
                image: e.target.result
            };
            categories.push(newCategory);
            saveData('categories', categories);
            renderCategories();
            populateCategoryDropdown();
            categoryForm.reset();
        };
        reader.readAsDataURL(categoryImage);
    }
});

// Render category list
function renderCategories() {
    categoryList.innerHTML = '';
    categories.forEach((category, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${category.image}" alt="${category.name}">
            <div class="item-info">
                <strong>${category.name}</strong>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editCategory(${index})">Sửa</button>
                <button class="delete-btn" onclick="deleteCategory(${index})">Xóa</button>
            </div>
        `;
        categoryList.appendChild(li);
    });
}

function editCategory(index) {
    const newName = prompt('Nhập tên danh mục mới:', categories[index].name);
    if (newName) {
        categories[index].name = newName.trim();
        saveData('categories', categories);
        renderCategories();
        populateCategoryDropdown();
    }
}

function deleteCategory(index) {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
        categories.splice(index, 1);
        saveData('categories', categories);
        renderCategories();
        populateCategoryDropdown();
    }
}

// ========================================
// Quản Lý Banner
// ========================================
const bannerForm = document.getElementById('banner-form');
const bannerList = document.getElementById('banner-list');

// Load banners from localStorage
let banners = loadData('banners');
renderBanners();

// Handle banner form submission
bannerForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const bannerTitle = document.getElementById('banner-title').value.trim();
    const bannerDescription = document.getElementById('banner-description').value.trim();
    const bannerImage = document.getElementById('banner-image').files[0];

    if (bannerTitle && bannerDescription && bannerImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newBanner = {
                title: bannerTitle,
                description: bannerDescription,
                image: e.target.result
            };
            banners.push(newBanner);
            saveData('banners', banners);
            renderBanners();
            bannerForm.reset();
        };
        reader.readAsDataURL(bannerImage);
    }
});

// Render banner list
function renderBanners() {
    bannerList.innerHTML = '';
    banners.forEach((banner, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${banner.image}" alt="${banner.title}">
            <div class="item-info">
                <strong>${banner.title}</strong>
                <p>${banner.description}</p>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editBanner(${index})">Sửa</button>
                <button class="delete-btn" onclick="deleteBanner(${index})">Xóa</button>
            </div>
        `;
        bannerList.appendChild(li);
    });
}

function editBanner(index) {
    const newTitle = prompt('Nhập tiêu đề banner mới:', banners[index].title);
    const newDescription = prompt('Nhập mô tả mới:', banners[index].description);
    if (newTitle && newDescription) {
        banners[index].title = newTitle.trim();
        banners[index].description = newDescription.trim();
        saveData('banners', banners);
        renderBanners();
    }
}

function deleteBanner(index) {
    if (confirm('Bạn có chắc chắn muốn xóa banner này?')) {
        banners.splice(index, 1);
        saveData('banners', banners);
        renderBanners();
    }
}

// ========================================
// Quản Lý Sản Phẩm
// ========================================
const productForm = document.getElementById('product-form');
const productList = document.getElementById('product-list');

// Load products from localStorage
let products = loadData('products');
renderProducts();

// Handle product form submission
productForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const productName = document.getElementById('product-name').value.trim();
    const productDescription = document.getElementById('product-description').value.trim();
    const productPrice = document.getElementById('product-price').value.trim();
    const productCategoryIndex = document.getElementById('product-category').value;
    const productImage = document.getElementById('product-image').files[0];

    if (productName && productDescription && productPrice && productCategoryIndex && productImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newProduct = {
                name: productName,
                description: productDescription,
                price: productPrice,
                category: categories[productCategoryIndex].name,
                image: e.target.result
            };
            products.push(newProduct);
            saveData('products', products);
            renderProducts();
            productForm.reset();
        };
        reader.readAsDataURL(productImage);
    }
});

// Render product list
function renderProducts() {
    productList.innerHTML = '';
    products.forEach((product, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="item-info">
                <strong>${product.name}</strong>
                <p>${product.description}</p>
                <p>Giá: $${product.price}</p>
                <p>Danh mục: ${product.category}</p>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editProduct(${index})">Sửa</button>
                <button class="delete-btn" onclick="deleteProduct(${index})">Xóa</button>
            </div>
        `;
        productList.appendChild(li);
    });
}

function editProduct(index) {
    const newName = prompt('Nhập tên sản phẩm mới:', products[index].name);
    const newDescription = prompt('Nhập mô tả sản phẩm mới:', products[index].description);
    const newPrice = prompt('Nhập giá sản phẩm mới:', products[index].price);
    if (newName && newDescription && newPrice) {
        products[index].name = newName.trim();
        products[index].description = newDescription.trim();
        products[index].price = newPrice.trim();
        saveData('products', products);
        renderProducts();
    }
}

function deleteProduct(index) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        products.splice(index, 1);
        saveData('products', products);
        renderProducts();
    }
}
// Quản lý người dùng
let users = [
    { id: 1, username: "nguyenhoang", email: "nguyenhoang@gmail.com" },
    { id: 2, username: "lethi", email: "lethi@gmail.com" }
];

// Hiển thị danh sách người dùng
function renderUsers() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    users.forEach((user, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${user.username}</strong> (${user.email})
            <button onclick="editUser(${index})">Sửa</button>
            <button onclick="deleteUser(${index})">Xóa</button>
        `;
        userList.appendChild(li);
    });
}

// Chức năng sửa người dùng
function editUser(index) {
    const newUsername = prompt('Nhập tên người dùng mới:', users[index].username);
    const newEmail = prompt('Nhập email người dùng mới:', users[index].email);
    
    if (newUsername && newEmail) {
        users[index].username = newUsername.trim();
        users[index].email = newEmail.trim();
        renderUsers(); // Cập nhật danh sách người dùng
    }
}

// Chức năng xóa người dùng
function deleteUser(index) {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        users.splice(index, 1); // Xóa người dùng
        renderUsers(); // Cập nhật danh sách người dùng
    }
}

// Khởi chạy chức năng
renderUsers();

    // Quản lý đơn hàng
let orders = [
    { id: 1, status: "Đang xử lý", customer: "Nguyen Hoang" },
    { id: 2, status: "Hoàn tất", customer: "Le Thi" }
];

// Hiển thị danh sách đơn hàng
function renderOrders() {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';
    orders.forEach((order, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>Đơn hàng #${order.id}</strong> - Trạng thái: ${order.status} - Khách hàng: ${order.customer}
            <button onclick="updateOrderStatus(${index})">Cập Nhật</button>
            <button onclick="deleteOrder(${index})">Xóa</button>
        `;
        orderList.appendChild(li);
    });
}

// Chức năng cập nhật trạng thái đơn hàng
function updateOrderStatus(index) {
    const newStatus = prompt('Nhập trạng thái mới cho đơn hàng:', orders[index].status);
    if (newStatus) {
        orders[index].status = newStatus.trim();
        renderOrders(); // Cập nhật danh sách đơn hàng
    }
}

// Chức năng xóa đơn hàng
function deleteOrder(index) {
    if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
        orders.splice(index, 1); // Xóa đơn hàng
        renderOrders(); // Cập nhật danh sách đơn hàng
    }
}

// Khởi chạy chức năng
renderOrders();

// Dữ liệu sản phẩm với doanh thu (giả định)
let productsSold = [
    { id: 1, name: "Sản phẩm A", price: 50000 },
    { id: 2, name: "Sản phẩm B", price: 150000 }
];

// Tính tổng doanh thu
function generateSalesReport() {
    let totalSales = 0;
    productsSold.forEach(product => {
        totalSales += product.price; // Cộng giá từng sản phẩm đã bán
    });
    document.getElementById('sales-report').textContent = `Tổng Doanh Thu: ${totalSales.toLocaleString()} VND`;
}

// Khởi chạy báo cáo
generateSalesReport();


