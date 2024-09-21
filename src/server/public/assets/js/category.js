document.addEventListener("DOMContentLoaded", () => {
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const listCategory = document.querySelector(".list-category");

    let scrollAmount = 0;
    const itemWidth = 174.9;
    const itemsToShow = 8;

    nextBtn.addEventListener("click", () => {
        if (
            scrollAmount <
            (listCategory.children.length - itemsToShow) * itemWidth
        ) {
            scrollAmount += itemWidth;
            listCategory.style.transform = `translateX(-${scrollAmount}px)`;
        }
    });

    prevBtn.addEventListener("click", () => {
        if (scrollAmount > 0) {
            scrollAmount -= itemWidth;
            listCategory.style.transform = `translateX(-${scrollAmount}px)`;
        }
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/api/v1/categories");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const categories = await response.json();

        const categoryList = document.getElementById("category-list");
        if (!categoryList) {
            throw new Error('Element with id "category-list" not found');
        }

        categories.forEach((category) => {
            const listItem = document.createElement("li");
            listItem.className = "category-item";

            listItem.innerHTML = `
                <a href="product.html?categoryId=${category.DM_Ma}">
                    <img src="/images/categories/${category.DM_HinhAnh.trim()}" alt="${
                category.DM_Ten
            }" class="cate-icon">
                    <span>
                        <b>${
                            category.DM_Ten.charAt(0).toUpperCase() +
                            category.DM_Ten.slice(1)
                        }</b>
                    </span>
                </a>
            `;

            categoryList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
});
