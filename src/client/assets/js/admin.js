// Utility function to load data from localStorage
function loadData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Utility function to save data to localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
// ========================================
// Xác Thực Admin
// ========================================
const loginForm = document.getElementById('login-form');
const adminMain = document.getElementById('admin-main');
const loginSection = document.getElementById('login-section');

// Đặt thông tin đăng nhập mặc định (trong thực tế, nên để backend quản lý)
const adminCredentials = {
    username: 'admin',
    password: 'password123'
};

// Kiểm tra xem admin đã đăng nhập chưa
function checkLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        loginSection.style.display = 'none';
        adminMain.style.display = 'block';
    }
}

checkLogin();

// Xử lý đăng nhập
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();

    if (username === adminCredentials.username && password === adminCredentials.password) {
        localStorage.setItem('isLoggedIn', 'true');
        loginSection.style.display = 'none';
        adminMain.style.display = 'block';
    } else {
        alert('Tên đăng nhập hoặc mật khẩu không chính xác!');
    }
});

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
                <h3>${banner.title}</h3>
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
    const newDescription = prompt('Nhập mô tả banner mới:', banners[index].description);
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
    const productPrice = parseFloat(document.getElementById('product-price').value);
    const productCategoryIndex = document.getElementById('product-category').value;
    const productImage = document.getElementById('product-image').files[0];

    if (productName && productDescription && !isNaN(productPrice) && productCategoryIndex !== "" && productImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newProduct = {
                name: productName,
                description: productDescription,
                price: productPrice,
                categoryIndex: parseInt(productCategoryIndex),
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
        const categoryName = categories[product.categoryIndex]?.name || 'Không xác định';
        li.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="item-info">
                <strong>${product.name}</strong>
                <p>${product.description}</p>
                <p>Giá: $${product.price.toFixed(2)}</p>
                <p>Danh Mục: ${categoryName}</p>
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
    const product = products[index];
    const newName = prompt('Nhập tên sản phẩm mới:', product.name);
    const newDescription = prompt('Nhập mô tả sản phẩm mới:', product.description);
    const newPrice = prompt('Nhập giá sản phẩm mới:', product.price);
    const newCategoryIndex = prompt('Nhập chỉ số danh mục mới (0, 1, 2, ...):', product.categoryIndex);

    if (newName && newDescription && !isNaN(parseFloat(newPrice)) && newCategoryIndex !== "") {
        products[index].name = newName.trim();
        products[index].description = newDescription.trim();
        products[index].price = parseFloat(newPrice);
        products[index].categoryIndex = parseInt(newCategoryIndex);
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
