const $ = document.querySelector.bind(document); 
const $$ = document.querySelectorAll.bind(document);

function load(selector, path) {
    const cached = localStorage.getItem(path);
    if (cached) {
        $(selector).innerHTML = cached;
    }

    fetch(path, {})
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
                await fetch("/api/v1/customer/logout", {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                localStorage.removeItem("authToken");
                localStorage.removeItem("username");
                localStorage.removeItem("productIds");
                localStorage.removeItem("productCount");

                window.location.href = "./login.html";
            } catch (error) {
                console.error("Đăng xuất thất bại:", error.message);
            }
        });
    }
});

function loadCategories() {
    fetch("/api/v1/categories", {
        method: "GET",
    })
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

function goBack() {
    window.history.back();
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


document.addEventListener("DOMContentLoaded", function () {
  const images = [
    "./assets/img/ad-banner/shoecollection.jpg",
    "./assets/img/ad-banner/furniturebanner.png",
    "./assets/img/ad-banner/family.jpg",
  ];
  let currentIndex = 0;
  let slideInterval;

  function updateImage() {
    const imgElement = document.getElementById("product-image");
    if (!imgElement) {
      console.error("Không tìm thấy phần tử img với id='product-image'");
      return;
    }
    imgElement.src = images[currentIndex];
  }

  function prevImage() {
    currentIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    updateImage();
    resetInterval();
  }

  function nextImage() {
    currentIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    updateImage();
    resetInterval();
  }

  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextImage, 3000);
  }

  // Kiểm tra sự tồn tại của phần tử trước khi thao tác
  const imgElement = document.getElementById("product-image");
  if (imgElement) {
    updateImage();
    slideInterval = setInterval(nextImage, 3000);
  } else {
    // console.error("Không tìm thấy phần tử img với id='product-image'");
  }

  // Kiểm tra nút trước khi thêm sự kiện
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");

  if (leftArrow && rightArrow) {
    leftArrow.addEventListener("click", prevImage);
    rightArrow.addEventListener("click", nextImage);
  } else {
    // console.error("Không tìm thấy phần tử .left-arrow hoặc .right-arrow");
  }
});



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
// ====tìm sản phẩm===
document.addEventListener("DOMContentLoaded", async function () {
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get("query");
  const currentPage = parseInt(params.get("page")) || 1;
  const productsPerPage = 20;

  const container = document.getElementById("product-container");

  // Đảm bảo phần tử phân trang có mặt trong DOM
  let paginationContainer = document.querySelector(".pagination");
  if (!paginationContainer) {
    paginationContainer = document.createElement("div");
    paginationContainer.className = "pagination";
    container.parentNode.insertBefore(
      paginationContainer,
      container.nextSibling
    );
  }

  if (!container) {
    console.error("Không tìm thấy phần tử 'product-container' trong DOM.");
    return;
  }

  try {
    // Lấy danh sách thương hiệu
    const brandApiUrl = "/api/v1/brands";
    const brandsResponse = await fetch(brandApiUrl);
    if (!brandsResponse.ok)
      throw new Error("Không thể lấy danh sách thương hiệu.");
    const brands = await brandsResponse.json();
    const brandsMap = new Map(
      brands.map((brand) => [brand.TH_Ma, brand.TH_Ten])
    );

    // Tìm kiếm sản phẩm
    const response = await fetch(`/api/v1/product/name/${searchQuery}`);
    if (!response.ok) throw new Error("Tìm kiếm không thành công.");

    const products = await response.json();
    console.log(`🔍 Tổng số sản phẩm tìm thấy: ${products.length}`);

    if (products.length === 0) {
      container.innerHTML = "<p>Không tìm thấy sản phẩm phù hợp.</p>";
      paginationContainer.innerHTML = ""; // Ẩn phân trang nếu không có sản phẩm
      return;
    }

    // Tính toán số trang
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    // Cắt danh sách sản phẩm theo trang
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, totalProducts);
    const currentProducts = products.slice(startIndex, endIndex);

    // Cập nhật tiêu đề kết quả
    const heading = document.querySelector(".home__heading");
    if (heading) {
      heading.textContent = `Kết quả tìm kiếm: ${totalProducts} sản phẩm cho "${searchQuery}"`;
    }

    // Hiển thị sản phẩm của trang hiện tại
    container.innerHTML = currentProducts
      .map((product) => {
        const brandName = brandsMap.get(product.TH_Ma) || "Không xác định";
        return `
          <div class="col">
              <a href="product-detail.html?id=${product.SP_Ma}">
                  <article class="product-card">
                      <div class="product-card__img-wrap">
                          <img src="/images/products/${product.SP_HinhAnh}" 
                               alt="${product.SP_Ten}" 
                               class="product-card__thumb" />
                      </div>
                      <h3 class="product-card__title">
                          ${
                            product.SP_Ten.charAt(0).toUpperCase() +
                            product.SP_Ten.slice(1)
                          }
                      </h3>
                      <p class="product-card__brand">
                          ${
                            brandName.charAt(0).toUpperCase() +
                            brandName.slice(1)
                          }
                      </p>
                      <div class="product-card__row">
                          <span class="product-card__price">₫${product.SP_DonGia.toLocaleString()}</span>
                      </div>
                  </article>
              </a>
          </div>`;
      })
      .join("");

    // Gọi hàm tạo phân trang
    createPagination(totalPages, currentPage, searchQuery);
  } catch (err) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", err);
    container.innerHTML = "<p>Có lỗi xảy ra, vui lòng thử lại sau.</p>";
    paginationContainer.innerHTML = ""; // Ẩn phân trang nếu có lỗi
  }
});


function createPagination(totalPages, currentPage, searchQuery) {
  let paginationContainer = document.querySelector(".pagination");

  if (!paginationContainer) {
    console.warn(
      "Không tìm thấy phần tử '.pagination', không thể tạo phân trang."
    );
    return;
  }

  let paginationHTML = "";

  // Nút "Trước"
  paginationHTML += `
    <a href="${
      currentPage > 1 ? `?query=${searchQuery}&page=${currentPage - 1}` : "#"
    }" 
       class="pagination__item ${
         currentPage === 1 ? "pagination__item--disabled" : ""
       }">
      &laquo;
    </a>
  `;

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (startPage > 1) {
    paginationHTML += `<a href="?query=${searchQuery}&page=1" class="pagination__item">1</a>`;
    if (startPage > 2)
      paginationHTML += `<span class="pagination__item pagination__item--disabled">...</span>`;
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <a href="?query=${searchQuery}&page=${i}" 
         class="pagination__item ${
           i === currentPage ? "pagination__item--active" : ""
         }">
        ${i}
      </a>
    `;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1)
      paginationHTML += `<span class="pagination__item pagination__item--disabled">...</span>`;
    paginationHTML += `<a href="?query=${searchQuery}&page=${totalPages}" class="pagination__item">${totalPages}</a>`;
  }

  // Nút "Sau"
  paginationHTML += `
    <a href="${
      currentPage < totalPages
        ? `?query=${searchQuery}&page=${currentPage + 1}`
        : "#"
    }" 
       class="pagination__item ${
         currentPage === totalPages ? "pagination__item--disabled" : ""
       }">
      &raquo;
    </a>
  `;

  paginationContainer.innerHTML = paginationHTML;
}

// ===tìm kiếm====
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

// Hàm cập nhật số lượng hàng trong giỏ <TỔNG TẤT CẢ>
// Hàm cập nhật số lượng sản phẩm trong giỏ
// Gọi hàm này để cập nhật số lượng sản phẩm khi DOMContentLoaded


//Hàm hiển thị sản phẩm
// Hàm hiển thị giỏ hàng
async function updateCartPreview() {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("authToken"); // Lấy token từ localStorage

  if (!username || !token) {
    console.log("Người dùng chưa đăng nhập hoặc thiếu token.");
    return;
  }

  try {
    // Lấy thông tin khách hàng
    const customerResponse = await fetch(
      `http://localhost:8081/api/v1/customer/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );

    if (!customerResponse.ok) {
      if (customerResponse.status === 401) {
        throw new Error("Không được phép. Vui lòng đăng nhập lại.");
      }
      throw new Error("Không thể lấy thông tin khách hàng.");
    }

    const customerData = await customerResponse.json();
    const customerId = customerData.KH_Ma;

    if (!customerId) {
      console.log("Không tìm thấy thông tin khách hàng.");
      return;
    }

    // Lấy thông tin giỏ hàng
    const cartResponse = await fetch(
      `http://localhost:8081/api/v1/cart/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    if (!cartResponse.ok) {
      if (cartResponse.status === 401) {
        throw new Error("Không được phép. Vui lòng đăng nhập lại.");
      }
      throw new Error("Không thể lấy thông tin giỏ hàng.");
    }

    const cartData = await cartResponse.json();

    if (!cartData.success || !cartData.data.items.length) {
      console.log("Giỏ hàng trống.");
      return;
    }

    const cartContainer = document.querySelector(".act-dropdown__list");
    cartContainer.innerHTML = "";

    const subtotalElement = document.querySelector(
      ".act-dropdown__row .act-dropdown__value"
    );
    const totalElement = document.querySelector(
      ".act-dropdown__row--bold .act-dropdown__value"
    );

    let subtotal = 0;
    const shippingFee = 10;

    // Hiển thị sản phẩm trong giỏ hàng
    cartData.data.items.forEach((item) => {
      const productElement = document.createElement("div");
      productElement.classList.add("col");

      productElement.innerHTML = `
                <article class="cart-preview-item">
                    <div class="cart-preview-item__img-wrap">
                        <img src="http://localhost:8081/images/products/${item.SP_HinhAnh}" 
                             alt="${item.SP_Ten}" 
                             class="cart-preview-item__thumb" />
                    </div>
                    <h3 class="cart-preview-item__title">${item.SP_Ten}</h3>
                    <p class="cart-preview-item__price">$${item.DonGia}</p>
                    <p class="cart-preview-item__quantity">Số lượng: ${item.SoLuong}</p>
                </article>
            `;

      cartContainer.appendChild(productElement);

      subtotal += item.DonGia * item.SoLuong;
    });

    const total = subtotal + shippingFee;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
  } catch (err) {
    console.error("Lỗi khi lấy thông tin giỏ hàng:", err.message);
  }
}

// Gọi hàm updateCartPreview ngay khi trang load
document.addEventListener("DOMContentLoaded", function () {
  updateCartPreview();
});



// ===== Hàm hiển thị trong shoppingcart.html


window.addEventListener("DOMContentLoaded", async () => {
    const userName = localStorage.getItem("username");
    const anonymousUserId = sessionStorage.getItem("anonymousUserId");

    if (!userName && !anonymousUserId) {
        const response = await fetch("/api/v1/setAnonymousSession", {
            method: "GET",
        });

        if (response.ok) {
            const sessionData = await response.json();
            console.log("Anonymous session data:", sessionData);

            sessionStorage.setItem("anonymousUserId", sessionData.id);
        } else {
            console.error("Failed to set anonymous session");
        }
    } else {
        console.log(
            "User is logged in or anonymous session already exists:",
            anonymousUserId
        );
    }
});
