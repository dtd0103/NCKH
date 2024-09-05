// Category Management
const categoryForm = document.getElementById('category-form');
const categoryList = document.getElementById('category-list');

categoryForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const categoryName = document.getElementById('category-name').value;
    const categoryImage = document.getElementById('category-image').files[0];

    // Create a new category item
    const li = document.createElement('li');
    li.innerHTML = `
        <img src="${URL.createObjectURL(categoryImage)}" alt="${categoryName}" width="50">
        <span>${categoryName}</span>
        <button onclick="editCategory(this)">Edit</button>
        <button onclick="deleteCategory(this)">Delete</button>
    `;
    categoryList.appendChild(li);

    // Reset form
    categoryForm.reset();
});

function editCategory(button) {
    const li = button.parentNode;
    const categoryName = prompt('Enter new category name:', li.querySelector('span').textContent);
    if (categoryName) {
        li.querySelector('span').textContent = categoryName;
    }
}

function deleteCategory(button) {
    if (confirm('Are you sure you want to delete this category?')) {
        const li = button.parentNode;
        categoryList.removeChild(li);
    }
}

// Banner Management
const bannerForm = document.getElementById('banner-form');
const bannerList = document.getElementById('banner-list');

bannerForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const bannerTitle = document.getElementById('banner-title').value;
    const bannerDescription = document.getElementById('banner-description').value;
    const bannerImage = document.getElementById('banner-image').files[0];

    // Create a new banner item
    const li = document.createElement('li');
    li.innerHTML = `
        <img src="${URL.createObjectURL(bannerImage)}" alt="${bannerTitle}" width="100">
        <h3>${bannerTitle}</h3>
        <p>${bannerDescription}</p>
        <button onclick="editBanner(this)">Edit</button>
        <button onclick="deleteBanner(this)">Delete</button>
    `;
    bannerList.appendChild(li);

    // Reset form
    bannerForm.reset();
});

function editBanner(button) {
    const li = button.parentNode;
    const bannerTitle = prompt('Enter new banner title:', li.querySelector('h3').textContent);
    const bannerDescription = prompt('Enter new banner description:', li.querySelector('p').textContent);

    if (bannerTitle && bannerDescription) {
        li.querySelector('h3').textContent = bannerTitle;
        li.querySelector('p').textContent = bannerDescription;
    }
}

function deleteBanner(button) {
    if (confirm('Are you sure you want to delete this banner?')) {
        const li = button.parentNode;
        bannerList.removeChild(li);
    }
}
