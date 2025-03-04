const getUser = () => {
    if (typeof window !== "undefined") {
        return (
            localStorage.getItem("username") ||
            sessionStorage.getItem("anonymousUserId")
        );
    }
    return null;
};

const fetchRecommendations = async () => {
    const userId = getUser();

    if (!userId) {
        console.log(
            "Không tìm thấy userId! Người dùng chưa đăng nhập hoặc không có session."
        );
        return;
    }

    try {
        // 1️⃣ Lấy danh sách sản phẩm đã xem từ Node.js API
        const response = await fetch(
            `http://localhost:8081/api/v1/product/${userId}`
        );
        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log(data);

        const viewedProducts = data.productIds;
        console.log("Sản phẩm đã xem:", viewedProducts);

        if (viewedProducts.length === 0) {
            console.log("Người dùng chưa xem sản phẩm nào.");
            return;
        }

        // 2️⃣ Gửi danh sách sản phẩm đã xem đến FastAPI để lấy gợi ý
        const predictionResponse = await fetch(
            "http://127.0.0.1:8000/predict/",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_ids: viewedProducts }),
            }
        );

        if (!predictionResponse.ok)
            throw new Error(`HTTP error! Status: ${predictionResponse.status}`);
        const predictionData = await predictionResponse.json();

        const recommendedProductIds = predictionData.recommendations; // Mảng productId được gợi ý
        console.log("Gợi ý sản phẩm:", recommendedProductIds);

        if (recommendedProductIds.length === 0) {
            console.log("Không có sản phẩm nào được gợi ý.");
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
            throw new Error(
                `HTTP error! Status: ${productDetailsResponse.status}`
            );
        const productDetails = await productDetailsResponse.json();
        console.log(productDetails);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error.message);
    }
};

fetchRecommendations();
