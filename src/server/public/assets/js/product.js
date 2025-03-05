document.addEventListener("DOMContentLoaded", async function () {
    const productApiUrl = "/api/v1/products";
    const brandApiUrl = "/api/v1/brands";

    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get("categoryId") || ""; // Nếu null thì gán chuỗi rỗng
    const currentPage = parseInt(params.get("page")) || 1;
    const productsPerPage = 20;

    try {
        const productsResponse = await fetch(productApiUrl);
        if (!productsResponse.ok) throw new Error("Không thể lấy dữ liệu sản phẩm.");
        const products = await productsResponse.json();

        const brandsResponse = await fetch(brandApiUrl);
        if (!brandsResponse.ok) throw new Error("Không thể lấy dữ liệu thương hiệu.");
        const brands = await brandsResponse.json();

        const brandsMap = new Map(brands.map((brand) => [brand.TH_Ma, brand.TH_Ten]));

        let filteredProducts = categoryId
            ? products.filter((product) => product.DM_Ma == categoryId)
            : products;

        // Kiểm tra nếu không có sản phẩm nào
        if (filteredProducts.length === 0) {
            document.getElementById("product-container").innerHTML =
                "<p>Không có sản phẩm nào phù hợp.</p>";
            document.querySelector(".pagination").innerHTML = "";
            return;
        }

        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        const startIndex = (currentPage - 1) * productsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

        renderProducts(paginatedProducts, brandsMap);
        createPagination(totalPages, currentPage, categoryId);
    } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        document.getElementById("product-container").innerHTML = "<p>Có lỗi xảy ra, vui lòng thử lại sau.</p>";
    }
});

// Hàm hiển thị sản phẩm
function renderProducts(products, brandsMap) {
    const container = document.getElementById("product-container");
    container.innerHTML = products
        .map(
            (product) => `
            <div class="col product" data-product-id="${product.SP_Ma}">
                <a href="product-detail.html?id=${product.SP_Ma}">
                    <article class="product-card">
                        <div class="product-card__img-wrap">
                            <img src="/images/products/${product.SP_HinhAnh}" alt="" class="product-card__thumb" />
                        </div>
                        <h3 class="product-card__title">${product.SP_Ten}</h3>
                        <p class="product-card__brand">${brandsMap.get(product.TH_Ma) || "Unknown"}</p>
                        <div class="product-card__row">
                            <span class="product-card__price">$${product.SP_DonGia}</span>
                        </div>
                    </article>
                </a>
            </div>
        `
        )
        .join("");
}

// Hàm tạo phân trang
function createPagination(totalPages, currentPage, categoryId) {
    let paginationContainer = document.querySelector(".pagination");
    if (!paginationContainer) {
        console.warn("Không tìm thấy phần tử '.pagination'");
        return;
    }

    let paginationHTML = "";

    // Nút "Trước"
    paginationHTML += `
        <a href="?categoryId=${categoryId}&page=${currentPage - 1}"
           class="pagination__item ${currentPage === 1 ? "pagination__item--disabled" : ""}">
          &laquo;
        </a>
    `;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (startPage > 1) {
        paginationHTML += `<a href="?categoryId=${categoryId}&page=1" class="pagination__item">1</a>`;
        if (startPage > 2) paginationHTML += `<span class="pagination__item pagination__item--disabled">...</span>`;
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <a href="?categoryId=${categoryId}&page=${i}"
               class="pagination__item ${i === currentPage ? "pagination__item--active" : ""}">
              ${i}
            </a>
        `;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) paginationHTML += `<span class="pagination__item pagination__item--disabled">...</span>`;
        paginationHTML += `<a href="?categoryId=${categoryId}&page=${totalPages}" class="pagination__item">${totalPages}</a>`;
    }

    // Nút "Sau"
    paginationHTML += `
        <a href="?categoryId=${categoryId}&page=${currentPage + 1}"
           class="pagination__item ${currentPage === totalPages ? "pagination__item--disabled" : ""}">
          &raquo;
        </a>
    `;

    paginationContainer.innerHTML = paginationHTML;
}
