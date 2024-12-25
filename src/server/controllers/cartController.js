import Cart from "../models/cartModel.js";

const getCart = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    // Lấy hoặc tạo giỏ hàng cho khách hàng
    let cart = await Cart.getByCustomerId(customerId);

    if (!cart) {
      cart = await Cart.createCart(customerId);
    }

    // Lấy chi tiết giỏ hàng
    const cartDetails = await Cart.getCartDetails(cart.GH_Ma);

    res.status(200).json({
      success: true,
      data: {
        cart,
        items: cartDetails,
      },
    });
  } catch (err) {
    console.error("Lỗi truy vấn: " + err.message);
    res.status(500).json({
      success: false,
      message: "Lỗi trong quá trình lấy thông tin giỏ hàng.",
      error: err.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { customerId, productId, quantity, price } = req.body;

    // Lấy hoặc tạo giỏ hàng cho khách hàng
    let cart = await Cart.getByCustomerId(customerId);
    if (!cart) {
      cart = await Cart.createCart(customerId);
    }

    const cartItem = {
      GH_Ma: cart.GH_Ma,
      SP_Ma: productId,
      SoLuong: quantity,
      DonGia: price,
    };

    await Cart.addItem(cartItem);

    // Lấy thông tin giỏ hàng mới nhất
    const updatedCartDetails = await Cart.getCartDetails(cart.GH_Ma);

    res.status(200).json({
      success: true,
      message: "Thêm sản phẩm vào giỏ hàng thành công.",
      data: updatedCartDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi trong quá trình thêm sản phẩm vào giỏ hàng.",
      error: error.message,
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    await Cart.updateItem({
      GHCT_Ma: itemId,
      SoLuong: quantity,
    });

    res.status(200).json({
      success: true,
      message:
        quantity <= 0
          ? "Đã xóa sản phẩm khỏi giỏ hàng."
          : "Cập nhật số lượng sản phẩm thành công.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi trong quá trình cập nhật số lượng sản phẩm.",
      error: error.message,
    });
  }
};

const removeCartItem = async (req, res) => {
  try {
    await Cart.removeItem(req.params.id);
    res.status(200).json({
      success: true,
      message: "Xóa sản phẩm khỏi giỏ hàng thành công.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi trong quá trình xóa sản phẩm khỏi giỏ hàng.",
      error: error.message,
    });
  }
};

const getCartDetails = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cartDetails = await Cart.getCartDetails(cartId);

    if (!cartDetails || cartDetails.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "Giỏ hàng trống.",
      });
    }

    res.status(200).json({
      success: true,
      data: cartDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi trong quá trình lấy chi tiết giỏ hàng.",
      error: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    await Cart.clearCart(cartId);

    res.status(200).json({
      success: true,
      message: "Đã xóa tất cả sản phẩm trong giỏ hàng.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi trong quá trình xóa giỏ hàng.",
      error: error.message,
    });
  }
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  getCartDetails,
  clearCart,
};
