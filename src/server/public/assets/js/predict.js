// const getUser = () => {
//     if (typeof window !== "undefined") {
//         return (
//             localStorage.getItem("username") ||
//             sessionStorage.getItem("anonymousUserId")
//         );
//     }
//     return null;
// };

// const fetchRecommendations = async () => {
//     const userId = getUser();

//     if (!userId) {
//         console.log(
//             "Không tìm thấy userId! Người dùng chưa đăng nhập hoặc không có session."
//         );
//         return;
//     }

//     try {
//         // 1️⃣ Lấy danh sách sản phẩm đã xem từ Node.js API
//         const response = await fetch(
//             `http://localhost:8081/api/v1/product/${userId}`
//         );
//         if (!response.ok)
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         const data = await response.json();
//         console.log(data);

//         const viewedProducts = data.productIds;
//         console.log("Sản phẩm đã xem:", viewedProducts);

//         if (viewedProducts.length === 0) {
//             console.log("Người dùng chưa xem sản phẩm nào.");
//             return;
//         }

//         // 2️⃣ Gửi danh sách sản phẩm đã xem đến FastAPI để lấy gợi ý
//         const predictionResponse = await fetch(
//             "http://127.0.0.1:8000/predict/",
//             {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ product_ids: viewedProducts }),
//             }
//         );

//         if (!predictionResponse.ok)
//             throw new Error(`HTTP error! Status: ${predictionResponse.status}`);
//         const predictionData = await predictionResponse.json();

//         const recommendedProductIds = predictionData.recommendations; // Mảng productId được gợi ý
//         console.log("Gợi ý sản phẩm:", recommendedProductIds);

//         if (recommendedProductIds.length === 0) {
//             console.log("Không có sản phẩm nào được gợi ý.");
//             return;
//         }

//         const productDetailsResponse = await fetch(
//             "http://localhost:8081/api/v1/product/ids",
//             {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ productIds: recommendedProductIds }),
//             }
//         );

//         if (!productDetailsResponse.ok)
//             throw new Error(
//                 `HTTP error! Status: ${productDetailsResponse.status}`
//             );
//         const productDetails = await productDetailsResponse.json();
//         console.log(productDetails);
//     } catch (error) {
//         console.error("Lỗi khi lấy dữ liệu:", error.message);
//     }
// };

// fetchRecommendations();
document.addEventListener("DOMContentLoaded", async function () {
    const productsPerPage = 20;
    const container = document.getElementById("product-container");

    if (!container) {
        console.error("Không tìm thấy phần tử 'product-container' trong DOM.");
        return;
    }

    // Lấy userId từ LocalStorage hoặc SessionStorage
    const getUser = () => {
        if (typeof window !== "undefined") {
            return (
                localStorage.getItem("username") ||
                sessionStorage.getItem("anonymousUserId")
            );
        }
        return null;
    };

    const userId = getUser();
    if (!userId) {
        console.log(
            "Không tìm thấy userId! Người dùng chưa đăng nhập hoặc không có session."
        );
        container.innerHTML =
            "<p>Vui lòng đăng nhập để xem gợi ý sản phẩm.</p>";
        return;
    }

    try {
        const viewedResponse = await fetch(
            `http://localhost:8081/api/v1/product/${userId}`
        );
        if (!viewedResponse.ok)
            throw new Error("Không thể lấy danh sách sản phẩm đã xem.");
        const viewedData = await viewedResponse.json();

        const viewedProducts = viewedData.productIds;
        console.log("Sản phẩm đã xem:", viewedProducts);

        if (viewedProducts.length === 0) {
            container.innerHTML = "<p>Bạn chưa xem sản phẩm nào.</p>";
            return;
        }

        console.log({ product_ids: viewedProducts });

        const predictionResponse = await fetch(
            "http://127.0.0.1:8000/predict/",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_ids: viewedProducts }),
            }
        );

        if (!predictionResponse.ok)
            throw new Error("Lỗi khi lấy danh sách gợi ý.");
        const predictionData = await predictionResponse.json();
        const recommendedProductIds = predictionData.recommendations;
        console.log("Gợi ý sản phẩm:", recommendedProductIds);

        if (recommendedProductIds.length === 0) {
            container.innerHTML = "<p>Không có sản phẩm nào được gợi ý.</p>";
            return;
        }

        const productDetailsResponse = await fetch(
            "http://localhost:8081/api/v1/product/ids",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productIds: recommendedProductIds }),
            }
        );

        if (!productDetailsResponse.ok)
            throw new Error("Không thể lấy chi tiết sản phẩm.");
        const responseData = await productDetailsResponse.json();
        const products = responseData.products || [];
        console.log("Danh sách sản phẩm:", products);

        const params = new URLSearchParams(window.location.search);
        const currentPage = parseInt(params.get("page")) || 1;

        const totalProducts = products.length;
        const totalPages = Math.ceil(totalProducts / productsPerPage);
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = Math.min(startIndex + productsPerPage, totalProducts);
        const currentProducts = products.slice(startIndex, endIndex);

        container.innerHTML = currentProducts
            .map((product) => {
                return `
                <div class="col">
                    <a href="product-detail.html?id=${product.SP_Ma}">
                        <article class="product-card">
                            <div class="product-card__img-wrap">
                                <img src="/images/products/${
                                    product.SP_HinhAnh
                                }" 
                                     alt="${product.SP_Ten}" 
                                     class="product-card__thumb" />
                            </div>
                            <h3 class="product-card__title">${
                                product.SP_Ten
                            }</h3>
                            <p class="product-card__brand">${
                                product.TH_Ten || "Không xác định"
                            }</p>
                            <div class="product-card__row">
                                <span class="product-card__price">₫${product.SP_DonGia.toLocaleString()}</span>
                            </div>
                        </article>
                    </a>
                </div>`;
            })
            .join("");

        createPagination(totalPages, currentPage);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error.message);
        container.innerHTML = "<p>Có lỗi xảy ra, vui lòng thử lại sau.</p>";
    }
});

function createPagination(totalPages, currentPage) {
    const paginationContainer = document.querySelector(".pagination");
    if (!paginationContainer) return;

    paginationContainer.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement("a");
        pageLink.href = `?page=${i}`;
        pageLink.textContent = i;
        if (i === currentPage) {
            pageLink.classList.add("active");
        }
        paginationContainer.appendChild(pageLink);
    }
}
