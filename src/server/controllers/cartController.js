import Cart from "../models/cartModel.js";

// Lấy tất cả giỏ hàng
const getAllCarts = async function (req, res) {
  try {
    const carts = await Cart.getAll();
    res.status(200).json(carts);
  } catch (err) {
    console.error("Lỗi truy vấn: " + err.message);
    res.status(500).send("Lỗi trong quá trình lấy thông tin giỏ hàng.");
  }
};

// Lấy thông tin một giỏ hàng
const getCart = async function (req, res) {
  try {
    const cart = await Cart.get(req.params.id);
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).send("Giỏ hàng không tồn tại.");
    }
  } catch (err) {
    console.error("Lỗi truy vấn: " + err.message);
    res.status(500).send("Lỗi trong quá trình lấy thông tin giỏ hàng.");
  }
};
const updateCart = async function (req, res) {
  try {
    const { id } = req.params; // ID của giỏ hàng
    const { customerId } = req.body; // Mã khách hàng mới

    if (!customerId) {
      return res
        .status(400)
        .send("Mã khách hàng là bắt buộc để cập nhật giỏ hàng.");
    }

    await Cart.updateCart(id, customerId);

    res.status(200).json({
      success: true,
      message: "Giỏ hàng đã được cập nhật thành công.",
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật giỏ hàng: " + err.message);
    res.status(500).send("Lỗi trong quá trình cập nhật giỏ hàng.");
  }
};
// Tạo mới một giỏ hàng
const createCart = async function (req, res) {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).send("Mã khách hàng là bắt buộc để tạo giỏ hàng.");
    }

    const result = await Cart.create(customerId);
    res.status(201).json({
      success: true,
      message: "Giỏ hàng được tạo thành công.",
      data: result,
    });
  } catch (error) {
    console.error("Lỗi khi tạo giỏ hàng: " + error.message);
    res.status(500).send("Lỗi trong quá trình tạo giỏ hàng.");
  }
};

// Thêm sản phẩm vào giỏ hàng
const addItemToCart = async function (req, res) {
  try {
    const { cartId, productId, quantity, price } = req.body;

    if (!cartId || !productId || !quantity || !price) {
      return res
        .status(400)
        .send("Vui lòng cung cấp đầy đủ thông tin sản phẩm.");
    }

    const cartItem = {
      GH_Ma: cartId,
      SP_Ma: productId,
      SoLuong: quantity,
      DonGia: price,
    };

    const result = await Cart.addItemToCart(cartItem);

    res.status(201).json({
      success: true,
      message: "Sản phẩm đã được thêm vào giỏ hàng.",
      data: result,
    });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm vào giỏ hàng: " + error.message);
    res.status(500).send("Lỗi trong quá trình thêm sản phẩm vào giỏ hàng.");
  }
};
const getCartItems = async function (req, res) {
  try {
    const { id } = req.params; // ID của giỏ hàng
    const items = await Cart.getCartItems(id);

    res.status(200).json({
      success: true,
      message: "Lấy danh sách sản phẩm trong giỏ hàng thành công.",
      data: items,
    });
  } catch (err) {
    console.error("Lỗi khi lấy sản phẩm trong giỏ hàng: " + err.message);
    res.status(500).send("Lỗi trong quá trình lấy danh sách sản phẩm.");
  }
};
// Cập nhật sản phẩm trong giỏ hàng
const updateCartItem = async function (req, res) {
  try {
    const { itemId, quantity, price } = req.body;

    if (!itemId || !quantity || !price) {
      return res
        .status(400)
        .send("Vui lòng cung cấp đầy đủ thông tin cập nhật.");
    }

    const updateData = {
      SoLuong: quantity,
      DonGia: price,
    };

    await Cart.updateCartItem(itemId, updateData);

    res.status(200).json({
      success: true,
      message: "Sản phẩm trong giỏ hàng đã được cập nhật.",
    });
  } catch (err) {
    console.error("Lỗi cập nhật sản phẩm trong giỏ hàng: " + err.message);
    res.status(500).send("Lỗi trong quá trình cập nhật sản phẩm.");
  }
};

// Xóa một sản phẩm khỏi giỏ hàng
const deleteCartItem = async function (req, res) {
  try {
    const { id } = req.params;

    await Cart.deleteCartItem(id);

    res.status(200).json({
      success: true,
      message: "Sản phẩm đã được xóa khỏi giỏ hàng.",
    });
  } catch (err) {
    console.error("Lỗi khi xóa sản phẩm: " + err.message);
    res.status(500).send("Lỗi trong quá trình xóa sản phẩm.");
  }
};

// Xóa toàn bộ giỏ hàng
const deleteCart = async function (req, res) {
  try {
    const { id } = req.params;

    await Cart.delete(id);

    res.status(200).json({
      success: true,
      message: "Giỏ hàng đã được xóa thành công.",
    });
  } catch (err) {
    console.error("Lỗi khi xóa giỏ hàng: " + err.message);
    res.status(500).send("Lỗi trong quá trình xóa giỏ hàng.");
  }
};

export default {
  getAllCarts,
  getCart,
  createCart,
  updateCart,
  getCartItems,
  addItemToCart,
  updateCartItem,
  deleteCartItem,
  deleteCart,
};
