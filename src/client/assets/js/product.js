document.addEventListener("DOMContentLoaded", async function () {
    const productApiUrl = "http://localhost:8081/api/v1/products";
    const brandApiUrl = "http://localhost:8081/api/v1/brands";

    try {
        const productsResponse = await fetch(productApiUrl);
        const products = await productsResponse.json();

        const brandsResponse = await fetch(brandApiUrl);
        const brands = await brandsResponse.json();
        const brandsMap = new Map(
            brands.map((brand) => [brand.TH_Ma, brand.TH_Ten])
        );

        const selectedProducts = getRandomProducts(products, 10);

        const container = document.getElementById("product-container");
        container.innerHTML = selectedProducts
            .map(
                (product) => `
            <div class="col">
                <a href="">
                    <article class="product-card">
                        <div class="product-card__img-wrap">
                            <a href="">
                                <img src="${
                                    product.SP_HinhAnh
                                }" alt="" class="product-card__thumb" />
                            </a>
                        </div>
                        <h3 class="product-card__title">
                            <a href="">${
                                product.SP_Ten.charAt(0).toUpperCase() +
                                product.SP_Ten.slice(1)
                            }</a>
                        </h3>
                        <p class="product-card__brand">${
                            brandsMap
                                .get(product.TH_Ma)
                                .charAt(0)
                                .toUpperCase() +
                                brandsMap.get(product.TH_Ma).slice(1) ||
                            "Unknown"
                        }</p>
                        <div class="product-card__row">
                            <span class="product-card__price">$${
                                product.SP_DonGia
                            }</span>
                            <div class="product-card__rating">
                                <img src="./assets/icons/star.svg" alt="" class="product-card__star" />
                                <img src="./assets/icons/star.svg" alt="" class="product-card__star" />
                                <img src="./assets/icons/star.svg" alt="" class="product-card__star" />
                                <img src="./assets/icons/star.svg" alt="" class="product-card__star" />
                                <img src="./assets/icons/star-half.svg" alt="" class="product-card__star" />
                                <span class="product-card__score">4.3</span>
                                </div>
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