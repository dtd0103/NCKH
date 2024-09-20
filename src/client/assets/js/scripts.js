const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function load(selector, path) {
    const cached = localStorage.getItem(path);
    if (cached) {
        $(selector).innerHTML = cached;
    }

    fetch(path)
        .then((res) => res.text())
        .then((html) => {
            if (html !== cached) {
                $(selector).innerHTML = html;
                localStorage.setItem(path, html);
            }
        })
        .finally(() => {
            window.dispatchEvent(new Event("template-loaded"));
        });
}

function checkLogin() {
    const token = localStorage.getItem("authToken");
    console.log("Token:", token);
    if (token) {
        load("#header", "./templates/header2-logined.html");
    } else {
        load("#header", "./templates/header2.html");
    }
}

window.addEventListener("template-loaded", () => {
    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            try {
                await fetch("http://localhost:8081/api/v1/customer/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`,
                    },
                });

                localStorage.removeItem("authToken");
                localStorage.removeItem("username");
                localStorage.removeItem("sessionid");

                window.location.href = "./login.html";
            } catch (error) {
                console.error("Đăng xuất thất bại:", error.message);
            }
        });
    }
});

function loadCategories() {
    fetch("http://localhost:8081/api/v1/categories")
        .then((res) => res.json())
        .then((categories) => {
            const categoryList = document.querySelector(
                ".sub-menu__item__children"
            );

            categoryList.innerHTML = "";

            categories.forEach((category) => {
                const li = document.createElement("li");
                li.classList.add("col-1__item", "col-1__item__link");

                const a = document.createElement("a");
                a.href = `product.html?categoryId=${category.DM_Ma}`;
                a.textContent =
                    category.DM_Ten.charAt(0).toUpperCase() +
                    category.DM_Ten.slice(1);
                a.classList.add("col-1__item__link");

                li.appendChild(a);
                categoryList.appendChild(li);
            });
        })
        .catch((error) => {
            console.error("Lỗi khi tải categories:", error);
        });
}

window.addEventListener("template-loaded", () => {
    loadCategories();
});

document.addEventListener("DOMContentLoaded", checkLogin);

function isHidden(element) {
    if (!element) return true;

    if (window.getComputedStyle(element).display === "none") {
        return true;
    }

    let parent = element.parentElement;
    while (parent) {
        if (window.getComputedStyle(parent).display === "none") {
            return true;
        }
        parent = parent.parentElement;
    }

    return false;
}

/**
 * Hàm buộc một hành động phải đợi
 * sau một khoảng thời gian mới được thực thi
 */
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

const calArrowPos = debounce(() => {
    if (isHidden($(".js-dropdown-list"))) return;

    const items = $$(".js-dropdown-list > li");

    items.forEach((item) => {
        const arrowPos = item.offsetLeft + item.offsetWidth / 2;
        item.style.setProperty("--arrow-left-pos", `${arrowPos}px`);
    });
});

// Tính toán lại vị trí arrow khi resize trình duyệt
window.addEventListener("resize", calArrowPos);

// Tính toán lại vị trí arrow sau khi tải template
window.addEventListener("template-loaded", calArrowPos);

window.addEventListener("template-loaded", handleActiveMenu);

function handleActiveMenu() {
    const dropdowns = $$(".js-dropdown");
    const menus = $$(".js-menu-list");
    const activeClass = "menu-column__item--active";

    const removeActive = (menu) => {
        menu.querySelector(`.${activeClass}`)?.classList.remove(activeClass);
    };

    const init = () => {
        menus.forEach((menu) => {
            const items = menu.children;
            if (!items.length) return;

            removeActive(menu);
            if (window.innerWidth > 991) items[0].classList.add(activeClass);

            Array.from(items).forEach((item) => {
                item.onmouseenter = () => {
                    if (window.innerWidth <= 991) return;
                    removeActive(menu);
                    item.classList.add(activeClass);
                };
                item.onclick = () => {
                    if (window.innerWidth > 991) return;
                    removeActive(menu);
                    item.classList.add(activeClass);
                    item.scrollIntoView();
                };
            });
        });
    };

    init();

    dropdowns.forEach((dropdown) => {
        dropdown.onmouseleave = () => init();
    });
}

window.addEventListener("template-loaded", initJsToggle);

function initJsToggle() {
    $$(".js-toggle").forEach((button) => {
        const target = button.getAttribute("toggle-target");
        if (!target) {
            document.body.innerText = `Cần thêm toggle-target cho: ${button.outerHTML}`;
        }
        button.onclick = (e) => {
            e.preventDefault();

            if (!$(target)) {
                return (document.body.innerText = `Không tìm thấy phần tử "${target}"`);
            }
            const isHidden = $(target).classList.contains("hide");

            requestAnimationFrame(() => {
                $(target).classList.toggle("hide", !isHidden);
                $(target).classList.toggle("show", isHidden);
            });
        };
        document.onclick = function (e) {
            if (!e.target.closest(target)) {
                const isHidden = $(target).classList.contains("hide");
                if (!isHidden) {
                    button.click();
                }
            }
        };
    });
}

window.addEventListener("template-loaded", () => {
    const links = $$(".js-dropdown-list > li > a");

    links.forEach((link) => {
        link.onclick = () => {
            if (window.innerWidth > 991) return;
            const item = link.closest("li");
            item.classList.toggle("navbar__item--active");
        };
    });
});

window.addEventListener("template-loaded", () => {
    const tabsSelector = "prod-tab__item";
    const contentsSelector = "prod-tab__content";

    const tabActive = `${tabsSelector}--current`;
    const contentActive = `${contentsSelector}--current`;

    const tabContainers = $$(".js-tabs");
    tabContainers.forEach((tabContainer) => {
        const tabs = tabContainer.querySelectorAll(`.${tabsSelector}`);
        const contents = tabContainer.querySelectorAll(`.${contentsSelector}`);
        tabs.forEach((tab, index) => {
            tab.onclick = () => {
                tabContainer
                    .querySelector(`.${tabActive}`)
                    ?.classList.remove(tabActive);
                tabContainer
                    .querySelector(`.${contentActive}`)
                    ?.classList.remove(contentActive);
                tab.classList.add(tabActive);
                contents[index].classList.add(contentActive);
            };
        });
    });
});
const isDark = localStorage.dark === "true";
document.querySelector("html").classList.toggle("dark", isDark);

document.addEventListener("DOMContentLoaded", () => {
    const slideshowItems = document.querySelectorAll(".slideshow__item");
    const currentNum = document.querySelector(".slideshow__num--current");
    const totalNum = document.querySelector(".slideshow__num--total");
    const nextButton = document.querySelector(".slideshow__button--next");
    const prevButton = document.querySelector(".slideshow__button--prev");
    let currentIndex = 0;

    totalNum.textContent = slideshowItems.length;

    function showSlide(index) {
        slideshowItems.forEach((item, i) => {
            item.classList.remove("active");
            if (i === index) {
                item.classList.add("active");
            }
        });
        currentNum.textContent = index + 1;
    }

    nextButton.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % slideshowItems.length;
        showSlide(currentIndex);
    });

    prevButton.addEventListener("click", () => {
        currentIndex =
            (currentIndex - 1 + slideshowItems.length) % slideshowItems.length;
        showSlide(currentIndex);
    });

    showSlide(currentIndex);
});

// slider
const images = [
    "./assets/img/ad-banner/shoecollection.jpg",
    "./assets/img/ad-banner/furniturebanner.png",
    "./assets/img/ad-banner/family.jpg",
];
let currentIndex = 0;
let slideInterval;

// Cập nhật hình ảnh dựa trên chỉ số hiện tại
function updateImage() {
    const imgElement = document.getElementById("product-image");
    imgElement.src = images[currentIndex];
}

// Chuyển đến ảnh trước
function prevImage() {
    currentIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    updateImage();
    resetInterval(); // Đặt lại thời gian khi chủ động chuyển trang
}

// Chuyển đến ảnh tiếp theo
function nextImage() {
    currentIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    updateImage();
    resetInterval(); // Đặt lại thời gian khi chủ động chuyển trang
}

// Thiết lập lại thời gian tự động trượt ảnh
function resetInterval() {
    clearInterval(slideInterval); // Hủy thời gian hiện tại
    slideInterval = setInterval(nextImage, 3000); // Thiết lập lại thời gian
}

// Khởi chạy khi trang được tải
window.onload = function () {
    updateImage();
    slideInterval = setInterval(nextImage, 3000); // Bắt đầu tự động trượt ảnh
};

// ==========
function updateFilters(filterType, filterValue) {
    const appliedFilters = document.getElementById("applied-filters");
    let existingFilter = document.querySelector(
        `li[data-filter="${filterType}"]`
    );

    if (filterValue) {
        if (existingFilter) {
            existingFilter.querySelector(
                "a"
            ).textContent = `${filterType}: ${filterValue}`;
        } else {
            let li = document.createElement("li");
            li.setAttribute("data-filter", filterType);

            let a = document.createElement("a");
            a.textContent = `${filterType}: ${filterValue}`;
            a.href = "#"; // Set this to the appropriate link if needed
            li.appendChild(a);

            appliedFilters.appendChild(li);
        }
    } else if (existingFilter) {
        appliedFilters.removeChild(existingFilter);
    }
}
// ====
function changePreview(index) {
    const items = document.querySelectorAll(".prod-preview__item");
    const thumbs = document.querySelectorAll(".prod-preview__thumb-img");

    // Ẩn tất cả các ảnh trong prod-preview__item
    items.forEach((item) => (item.style.display = "none"));

    // Xóa class --current khỏi tất cả các thumbnail
    thumbs.forEach((thumb) =>
        thumb.classList.remove("prod-preview__thumb-img--current")
    );

    // Hiển thị ảnh được chọn và thêm class --current vào thumbnail
    items[index].style.display = "block";
    thumbs[index].classList.add("prod-preview__thumb-img--current");
}

// Khởi tạo với việc chỉ hiển thị ảnh đầu tiên
document.addEventListener("DOMContentLoaded", function () {
    changePreview(0);
});

// ====form====
document.addEventListener("DOMContentLoaded", function () {
    const inputs = document.querySelectorAll(".form__input");

    inputs.forEach((input) => {
        // Handle input validation as the user types
        input.addEventListener("input", function () {
            handleValidation(this);
        });

        // Handle validation when the input loses focus (blur)
        input.addEventListener("blur", function () {
            handleValidation(this);
        });
    });

    function handleValidation(input) {
        const errorElement = input.parentElement.nextElementSibling;
        const iconElement = input.parentElement.querySelector(
            ".form__input-icon-error"
        );

        if (input.validity.valid) {
            errorElement.style.display = "none";
            iconElement.style.display = "none";
            input.classList.remove("input-error");
        } else {
            errorElement.style.display = "block";
            iconElement.style.display = "block";
            input.classList.add("input-error");
        }
    }
});

// =====heart======
document.addEventListener("DOMContentLoaded", function () {
    const likeBtns = document.querySelectorAll(".like-btn");

    likeBtns.forEach(function (likeBtn) {
        likeBtn.addEventListener("click", function (event) {
            event.preventDefault();

            this.classList.toggle("active");

            const likedIcon = this.querySelector(".like-btn__icon--liked");
            const defaultIcon = this.querySelector(".like-btn__icon");

            if (this.classList.contains("active")) {
                likedIcon.style.display = "inline";
                defaultIcon.style.display = "none";
            } else {
                likedIcon.style.display = "none";
                defaultIcon.style.display = "inline";
            }
        });
    });
});

// =====So luong
document.addEventListener("DOMContentLoaded", () => {
    // Lấy tất cả các phần tử chứa nút số lượng
    const quantityContainers = document.querySelectorAll(".cart-item__input");

    quantityContainers.forEach((container) => {
        const decreaseBtn = container.querySelector(".decrease-btn");
        const increaseBtn = container.querySelector(".increase-btn");
        const quantitySpan = container.querySelector(".quantity");

        let quantity = parseInt(quantitySpan.textContent); // Số lượng ban đầu từ phần tử

        decreaseBtn.addEventListener("click", () => {
            if (quantity > 1) {
                quantity--;
                quantitySpan.textContent = quantity;
            }
        });

        increaseBtn.addEventListener("click", () => {
            quantity++;
            quantitySpan.textContent = quantity;
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const radioButtons = document.querySelectorAll(
        'input[name="payment-method"]'
    );
    const cardInfo = document.getElementById("card-info");

    radioButtons.forEach((radio) => {
        radio.addEventListener("change", function () {
            if (this.value === "card") {
                cardInfo.classList.remove("hidden");
            } else {
                cardInfo.classList.add("hidden");
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("query");
    try {
        const response = await fetch(
            `http://localhost:8081/api/v1/product/name/${searchQuery}`
        );

        if (!response.ok) {
            throw new Error("Tìm kiếm không thành công.");
        }

        const products = await response.json();
        console.log(products);

        const container = document.getElementById("product-container");
        if (products.length === 0) {
            container.innerHTML = "<p>Không tìm thấy sản phẩm phù hợp.</p>";
        } else {
            container.innerHTML = products
                .map(
                    (product) => `
                        <div class="col">
                            <a href="product-detail.html?id=${product.SP_Ma}">
                                <article class="product-card">
                                    <div class="product-card__img-wrap">
                                        <img src="http://localhost:8081/images/product/${
                                            product.SP_HinhAnh
                                        }" alt="" class="product-card__thumb" />
                                    </div>
                                    <h3 class="product-card__title">
                                        ${
                                            product.SP_Ten.charAt(
                                                0
                                            ).toUpperCase() +
                                            product.SP_Ten.slice(1)
                                        }
                                    </h3>
                                    <p class="product-card__brand">Brand Name</p>
                                    <div class="product-card__row">
                                        <span class="product-card__price">$${
                                            product.SP_DonGia
                                        }</span>
                                    </div>
                                </article>
                            </a>
                        </div>`
                )
                .join("");
        }
    } catch (err) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", err);
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của form (reload trang)

        const searchQuery = searchInput.value.trim(); // Lấy giá trị từ input
        if (!searchQuery) {
            alert("Vui lòng nhập thông tin cần tìm.");
            return;
        }

        window.location.href = `search.html?query=${encodeURIComponent(
            searchQuery
        )}`;
    });
});
<<<<<<< HEAD
window.addEventListener("DOMContentLoaded", () => {
    const existingSessionId = localStorage.getItem("sessionid");

    if (existingSessionId) {
        console.log("Session ID đã tồn tại:", existingSessionId);
    } else {
        fetch("http://localhost:8081/api/v1/session-id")
            .then((response) => response.json())
            .then((data) => {
                console.log("Session ID:", data.sessionId);
                localStorage.setItem("sessionid", data.sessionId);

                setTimeout(() => {
                    localStorage.removeItem("sessionid");
                    console.log("Session ID đã được xóa sau 1 giờ.");
                }, 3600000);
            })
            .catch((error) => {
                console.error("Error fetching session ID:", error);
            });
    }
});

// window.addEventListener("DOMContentLoaded", () => {
//     const sessionId = localStorage.getItem("sessionid");

//     if (sessionId) {
//         fetch("http://localhost:8081/api/v1/validate-session", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ sessionId }), // Gửi sessionId
//         })
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error("Network response was not ok");
//                 }
//                 return response.json();
//             })
//             .then((data) => {
//                 console.log("Session validation result:", data);
//             })
//             .catch((error) => {
//                 console.error("Error validating session:", error);
//             });
//     } else {
//         console.log("No session ID found in localStorage.");
//     }
// });
=======
function goBack() {
  window.history.back();
}
>>>>>>> 5ea10304e9573451bc819a76b5bdce06b0fe5fd4
