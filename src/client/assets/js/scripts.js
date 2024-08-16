const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/**
 * Hàm tải template
 *
 * Cách dùng:
 * <div id="parent"></div>
 * <script>
 *  load("#parent", "./path-to-template.html");
 * </script>
 */
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

/**
 * Hàm kiểm tra một phần tử
 * có bị ẩn bởi display: none không
 */
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

/**
 * Hàm tính toán vị trí arrow cho dropdown
 *
 * Cách dùng:
 * 1. Thêm class "js-dropdown-list" vào thẻ ul cấp 1
 * 2. CSS "left" cho arrow qua biến "--arrow-left-pos"
 */
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

/**
 * Giữ active menu khi hover
 *
 * Cách dùng:
 * 1. Thêm class "js-menu-list" vào thẻ ul menu chính
 * 2. Thêm class "js-dropdown" vào class "dropdown" hiện tại
 *  nếu muốn reset lại item active khi ẩn menu
 */
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

/**
 * JS toggle
 *
 * Cách dùng:
 * <button class="js-toggle" toggle-target="#box">Click</button>
 * <div id="box">Content show/hide</div>
 */
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
                tabContainer.querySelector(`.${tabActive}`)?.classList.remove(tabActive);
                tabContainer.querySelector(`.${contentActive}`)?.classList.remove(contentActive);
                tab.classList.add(tabActive);
                contents[index].classList.add(contentActive);
            };
        });
    });
});

window.addEventListener("template-loaded", () => {
    const switchBtn = document.querySelector("#switch-theme-btn");
    if (switchBtn) {
        switchBtn.onclick = function () {
            const isDark = localStorage.dark === "true";
            document.querySelector("html").classList.toggle("dark", !isDark);
            localStorage.setItem("dark", !isDark);
            switchBtn.querySelector("span").textContent = isDark ? "Dark mode" : "Light mode";
        };
        const isDark = localStorage.dark === "true";
        switchBtn.querySelector("span").textContent = isDark ? "Light mode" : "Dark mode";
    }
});

const isDark = localStorage.dark === "true";
document.querySelector("html").classList.toggle("dark", isDark);
// ==========
document.addEventListener('DOMContentLoaded', () => {
    const slideshowItems = document.querySelectorAll('.slideshow__item');
    const currentNum = document.querySelector('.slideshow__num--current');
    const totalNum = document.querySelector('.slideshow__num--total');
    const nextButton = document.querySelector('.slideshow__button--next');
    const prevButton = document.querySelector('.slideshow__button--prev');
    let currentIndex = 0;
  
    // Update total number of items
    totalNum.textContent = slideshowItems.length;
  
    // Function to show slide based on index
    function showSlide(index) {
      slideshowItems.forEach((item, i) => {
        item.classList.remove('active');
        if (i === index) {
          item.classList.add('active');
        }
      });
      currentNum.textContent = index + 1;
    }
  
    // Event listeners for navigation buttons
    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slideshowItems.length;
      showSlide(currentIndex);
    });
  
    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slideshowItems.length) % slideshowItems.length;
      showSlide(currentIndex);
    });
  
    // Initial display
    showSlide(currentIndex);
  });

// slider
const images = [
    './assets/img/ad-banner/shoecollection.png',
    './assets/img/ad-banner/furniturebanner.png',
    './assets/img/ad-banner/fashion-banner.png'
  ];
  let currentIndex = 0;
  let slideInterval;
  
  // Cập nhật hình ảnh dựa trên chỉ số hiện tại
  function updateImage() {
      const imgElement = document.getElementById('product-image');
      imgElement.src = images[currentIndex];
  }
  
  // Chuyển đến ảnh trước
  function prevImage() {
      currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
      updateImage();
      resetInterval(); // Đặt lại thời gian khi chủ động chuyển trang
  }
  
  // Chuyển đến ảnh tiếp theo
  function nextImage() {
      currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
      updateImage();
      resetInterval(); // Đặt lại thời gian khi chủ động chuyển trang
  }
  
  // Thiết lập lại thời gian tự động trượt ảnh
  function resetInterval() {
      clearInterval(slideInterval); // Hủy thời gian hiện tại
      slideInterval = setInterval(nextImage, 3000); // Thiết lập lại thời gian
  }
  
  // Khởi chạy khi trang được tải
  window.onload = function() {
      updateImage();
      slideInterval = setInterval(nextImage, 3000); // Bắt đầu tự động trượt ảnh
  }
  
// ==========
function updateFilters(filterType, filterValue) {
    const appliedFilters = document.getElementById('applied-filters');
    let existingFilter = document.querySelector(`li[data-filter="${filterType}"]`);

    if (filterValue) {
        if (existingFilter) {
            existingFilter.querySelector('a').textContent = `${filterType}: ${filterValue}`;
        } else {
            let li = document.createElement('li');
            li.setAttribute('data-filter', filterType);

            let a = document.createElement('a');
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
    const items = document.querySelectorAll('.prod-preview__item');
    const thumbs = document.querySelectorAll('.prod-preview__thumb-img');

    // Ẩn tất cả các ảnh trong prod-preview__item
    items.forEach(item => item.style.display = 'none');

    // Xóa class --current khỏi tất cả các thumbnail
    thumbs.forEach(thumb => thumb.classList.remove('prod-preview__thumb-img--current'));

    // Hiển thị ảnh được chọn và thêm class --current vào thumbnail
    items[index].style.display = 'block';
    thumbs[index].classList.add('prod-preview__thumb-img--current');
}

// Khởi tạo với việc chỉ hiển thị ảnh đầu tiên
document.addEventListener('DOMContentLoaded', function () {
    changePreview(0);
});