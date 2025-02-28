document.addEventListener("DOMContentLoaded", async function () {
  const username = localStorage.getItem("username");
  if (!username) {
    alert("Vui lòng đăng nhập!");
    return;
  }

  try {
    // Lấy thông tin khách hàng từ API
    const customerResponse = await fetch(
      `http://localhost:8081/api/v1/customer/${username}`
    );
    if (!customerResponse.ok) {
      throw new Error("Không thể lấy thông tin khách hàng.");
    }
    const customerData = await customerResponse.json();
    const customerId = customerData.KH_Ma;

    // Lấy giỏ hàng của khách hàng từ API
    const cartResponse = await fetch(
      `http://localhost:8081/api/v1/cart/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    if (!cartResponse.ok) {
      throw new Error("Không thể lấy thông tin giỏ hàng.");
    }

    const cartData = await cartResponse.json();

    if (
      !cartData.success ||
      !cartData.data ||
      !cartData.data.items ||
      cartData.data.items.length === 0
    ) {
      alert("Giỏ hàng của bạn hiện tại trống.");
      window.location.href = "./index.html";
      return;
    }

    const cartContainer = document.querySelector(".cart-info__list");
    if (!cartContainer) {
      console.error("Không tìm thấy phần tử giỏ hàng trong DOM.");
      return;
    }

    cartContainer.innerHTML = ""; // Xóa nội dung giỏ hàng cũ

    // Duyệt qua tất cả các sản phẩm trong giỏ hàng
    for (const item of cartData.data.items) {
      const productId = item.SP_Ma;

      // Lấy số lượng tồn kho của sản phẩm từ API
      const productResponse = await fetch(
        `http://localhost:8081/api/v1/product/id/${productId}`
      );
      if (!productResponse.ok) {
        console.error(`Không thể lấy thông tin sản phẩm: ${productId}`);
        continue;
      }
      const productData = await productResponse.json();
      const stockQuantity = productData.SP_SoLuong || 0;

      const productPrice = parseFloat(item.DonGia) || 0;
      let cartQuantity = item.SoLuong || 0;
      let productTotal = productPrice * cartQuantity;

      const productElement = document.createElement("article");
      productElement.classList.add("cart-item");
      productElement.setAttribute("data-id", productId);

      productElement.innerHTML = `
        <a href="./product-detail.html?id=${productId}">
            <img src="http://localhost:8081/images/products/${item.SP_HinhAnh}" 
                 alt="${item.SP_Ten}" 
                 class="cart-item__thumb" />
        </a>
        <div class="cart-item__content">
            <div class="cart-item__content-left">
                <h3 class="cart-item__title">
                    <a href="./product-detail.html?id=${productId}">
                        ${item.SP_Ten}
                    </a>
                </h3>
                <p class="cart-item__price-wrap">
                    <span class="cart-item__price">Giá: ${productPrice.toFixed(
                      2
                    )}đ</span> | 
                    <span class="cart-item__status">Còn hàng</span>
                </p>
                <div class="cart-item__input">
                    <button class="cart-item__input-btn decrease-btn">
                        <img class="icon" src="./assets/icons/minus.svg" alt="minus" />
                    </button>
                    <span class="quantity">${cartQuantity}</span>
                    <button class="cart-item__input-btn increase-btn">
                        <img class="icon" src="./assets/icons/plus.svg" alt="plus" />
                    </button>
                </div>
            </div>
            <div class="cart-item__content-right">
                <p class="cart-item__total-price">${productTotal.toFixed(
                  2
                )}đ</p>
                <button class="cart-item__ctrl-btn delete-btn">
                    <img src="./assets/icons/trash.svg" alt="" />
                    Xóa
                </button>
            </div>
        </div>
      `;

      cartContainer.appendChild(productElement);

      const decreaseBtn = productElement.querySelector(".decrease-btn");
      const increaseBtn = productElement.querySelector(".increase-btn");
      const deleteBtn = productElement.querySelector(".delete-btn");
      const quantityDisplay = productElement.querySelector(".quantity");

      decreaseBtn.addEventListener("click", async function () {
        if (cartQuantity > 1) {
          cartQuantity--;
          item.SoLuong = cartQuantity;
          await updateItemQuantity(
            customerId,
            productId,
            cartQuantity,
            quantityDisplay
          );
          // Cập nhật lại giá trị tổng cho sản phẩm sau khi thay đổi số lượng
          productTotal = productPrice * cartQuantity;
          productElement.querySelector(
            ".cart-item__total-price"
          ).textContent = `${productTotal.toFixed(2)}đ`;
          await synchronizeCartData(customerId); // Cập nhật đồng bộ tất cả hiển thị giỏ hàng
        } else {
          // Khi số lượng giảm xuống 1, giảm tiếp về 0 và xóa sản phẩm
          await deleteCartItem(customerId, productId, productElement);
          await synchronizeCartData(customerId); // Cập nhật đồng bộ tất cả hiển thị giỏ hàng
        }
      });

      increaseBtn.addEventListener("click", async function () {
        if (cartQuantity < stockQuantity) {
          cartQuantity++;
          item.SoLuong = cartQuantity;
          await updateItemQuantity(
            customerId,
            productId,
            cartQuantity,
            quantityDisplay
          );
          // Cập nhật lại giá trị tổng cho sản phẩm sau khi thay đổi số lượng
          productTotal = productPrice * cartQuantity;
          productElement.querySelector(
            ".cart-item__total-price"
          ).textContent = `${productTotal.toFixed(2)}đ`;
          await synchronizeCartData(customerId); // Cập nhật đồng bộ tất cả hiển thị giỏ hàng
        } else {
          alert(
            `Không thể tăng số lượng vì chỉ còn ${stockQuantity} sản phẩm trong kho.`
          );
        }
      });

      deleteBtn.addEventListener("click", async function () {
        await deleteCartItem(customerId, productId, productElement);
        await synchronizeCartData(customerId); // Cập nhật đồng bộ tất cả hiển thị giỏ hàng
      });
    }

    await synchronizeCartData(customerId); // Cập nhật đồng bộ tất cả hiển thị giỏ hàng khi lần đầu tải giỏ hàng
  } catch (err) {
    console.error("Lỗi khi lấy thông tin giỏ hàng:", err);
    alert("Đã xảy ra lỗi khi tải giỏ hàng. Vui lòng thử lại sau.");
  }
});

async function updateItemQuantity(
  customerId,
  itemId,
  quantity,
  quantityDisplay
) {
  try {
    const response = await fetch("http://localhost:8081/api/v1/cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ customerId, itemId, quantity }),
    });

    if (response.ok) {
      quantityDisplay.textContent = quantity;
      // alert("Cập nhật số lượng thành công.");
    } else {
      const error = await response.json();
      alert(error.message || "Không thể cập nhật số lượng sản phẩm.");
    }
  } catch (err) {
    console.error("Lỗi khi cập nhật số lượng sản phẩm:", err);
    alert("Không thể cập nhật số lượng sản phẩm. Vui lòng thử lại.");
  }
}

async function deleteCartItem(customerId, itemId, productElement) {
  try {
    // Gọi API để lấy cartId bằng customerId
    const cartResponse = await fetch(
      `http://localhost:8081/api/v1/cart/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    if (!cartResponse.ok) {
      throw new Error("Không thể lấy thông tin giỏ hàng.");
    }

    const cartData = await cartResponse.json();
    const cartId = cartData.data.cart.GH_Ma; // Lấy cartId từ GH_Ma

    console.log("Thông tin xóa sản phẩm:");
    console.log("Customer ID:", customerId);
    console.log("Cart ID:", cartId);
    console.log("Item ID:", itemId);

    // Gọi API để xóa sản phẩm khỏi giỏ hàng
    const deleteResponse = await fetch(
      `http://localhost:8081/api/v1/cart/${cartId}/item/${itemId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    if (deleteResponse.ok) {
      productElement.remove(); // Xóa sản phẩm khỏi DOM
      alert("Sản phẩm đã được xóa khỏi giỏ hàng.");
    } else {
      const error = await deleteResponse.json();
      console.error("Lỗi khi xóa sản phẩm:", error); // Log lỗi chi tiết
      alert(error.message || "Không thể xóa sản phẩm.");
    }
  } catch (err) {
    console.error("Lỗi khi xóa sản phẩm:", err); // In lỗi chi tiết
    alert("Không thể xóa sản phẩm. Vui lòng thử lại.");
  }
}

function updateCartTotals(customerId) {
  return fetch(`http://localhost:8081/api/v1/cart/${customerId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Không thể lấy thông tin giỏ hàng.");
      }
      return response.json();
    })
    .then((cartData) => {
      if (cartData.success && cartData.data && cartData.data.items) {
        let subtotal = 0;
        let totalQuantity = 0;
        const shippingFee = 10.0;

        cartData.data.items.forEach((item) => {
          const quantity = item.SoLuong || 0;
          const productPrice = parseFloat(item.DonGia) || 0;
          subtotal += productPrice * quantity;
          totalQuantity += quantity;
        });

        const total = subtotal + shippingFee;

        document.querySelector(
          ".cart-info__row span:nth-child(2)"
        ).textContent = totalQuantity;
        document.querySelector(
          ".cart-info__subtotal"
        ).textContent = `${subtotal.toFixed(2)}đ`;
        document.querySelector(
          ".cart-info__shipping-fee"
        ).textContent = `${shippingFee.toFixed(2)}đ`;
        document.querySelector(
          ".cart-info__total"
        ).textContent = `${total.toFixed(2)}đ`;
      } else {
        alert("Giỏ hàng của bạn hiện tại trống.");
        window.location.href = "./index.html";
      }
    })
    .catch((err) => {
      console.error("Lỗi khi cập nhật tổng giá:", err);
      alert("Không thể cập nhật tổng giá. Vui lòng thử lại.");
    });
}

// Hàm hiển thị giỏ hàng xem trước
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
    if (!cartContainer) {
      console.log("Không tìm thấy phần tử .act-dropdown__list trong DOM.");
      return;
    }

    cartContainer.innerHTML = "";

    const subtotalElement = document.querySelector(
      ".act-dropdown__row .act-dropdown__value"
    );
    const totalElement = document.querySelector(
      ".act-dropdown__row--bold .act-dropdown__value"
    );

    if (!subtotalElement || !totalElement) {
      console.log("Không tìm thấy phần tử hiển thị tổng giá trong DOM.");
      return;
    }

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

// Hàm đồng bộ cả hai phần hiển thị giỏ hàng
async function synchronizeCartData(customerId) {
  // Cập nhật tổng số trong trang giỏ hàng chính
  await updateCartTotals(customerId);

  // Cập nhật phần xem trước giỏ hàng trên tất cả các trang
  await updateCartPreview();
}
