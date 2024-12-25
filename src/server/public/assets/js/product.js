document.addEventListener("DOMContentLoaded", async function () {
    const productApiUrl = "/api/v1/products";
    const brandApiUrl = "/api/v1/brands";

    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get("categoryId");

    try {
        const productsResponse = await fetch(productApiUrl, {
            method: "GET",
        });
        const products = await productsResponse.json();

        const brandsResponse = await fetch(brandApiUrl, {
            method: "GET",
        });
        const brands = await brandsResponse.json();
        const brandsMap = new Map(
            brands.map((brand) => [brand.TH_Ma, brand.TH_Ten])
        );

        let filteredProducts;
        if (categoryId) {
            filteredProducts = products.filter(
                (product) => product.DM_Ma === parseInt(categoryId)
            );
        } else {
            filteredProducts = getRandomProducts(products, 10);
        }

        const container = document.getElementById("product-container"); // let productImg = `/images/product/${product.SP_HinhAnh}`;
        container.innerHTML = filteredProducts
            .map(
                (product) => `
                <div class="col product" data-product-id="${product.SP_Ma}">
                    <a href="product-detail.html?id=${product.SP_Ma}">
                        <article class="product-card">
                            <div class="product-card__img-wrap">
                                <img src="/images/products/${
                                    product.SP_HinhAnh
                                }" alt="" class="product-card__thumb" />
                            </div>
                            <h3 class="product-card__title">${
                                product.SP_Ten.charAt(0).toUpperCase() +
                                product.SP_Ten.slice(1)
                            }</h3>
                            <p class="product-card__brand">${
                                brandsMap
                                    .get(product.TH_Ma)
                                    ?.charAt(0)
                                    .toUpperCase() +
                                    brandsMap.get(product.TH_Ma)?.slice(1) ||
                                "Unknown"
                            }</p>
                            <div class="product-card__row">
                                <span class="product-card__price">$${
                                    product.SP_DonGia
                                }</span>
                            </div>
                        </article>
                    </a>
                </div>
            `
            )
            .join("");
    } catch (err) {
        console.error("Lỗi: ", err);
    }

    function getRandomProducts(products, count) {
        const shuffled = products.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
});
