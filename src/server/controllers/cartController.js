import Cart from "../models/cartModel.js";

const getCart = async (req, res) => {
    try {
        const customerId = req.params.customerId;

        let cart = await Cart.getByCustomerId(customerId);

        if (!cart) {
            cart = await Cart.createCart(customerId);
        }

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

        // Cập nhật lại tổng tiền giỏ hàng
        await Cart.updateTotalAmount(cart.GH_Ma);

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
        const { customerId, itemId, quantity } = req.body;

        // Bước 1: Tìm giỏ hàng của người dùng
        const cart = await Cart.getByCustomerId(customerId);
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Giỏ hàng không tìm thấy.",
            });
        }

        // Bước 2: Tìm chi tiết sản phẩm trong giỏ hàng dựa trên SP_Ma và GH_Ma
        const itemDetails = await Cart.getCartDetails(cart.GH_Ma); // Lấy tất cả sản phẩm trong giỏ hàng
        console.log(itemDetails);
        const itemToUpdate = itemDetails.find((item) => {
            // Kiểm tra kiểu dữ liệu để đảm bảo so sánh chính xác
            return item.SP_Ma === parseInt(itemId); // Cố gắng chuyển itemId về kiểu int nếu nó là chuỗi
        }); // Tìm sản phẩm theo SP_Ma
        console.log(itemToUpdate);
        if (!itemToUpdate) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tìm thấy trong giỏ hàng của bạn.",
            });
        }

        // Bước 3: Cập nhật số lượng sản phẩm
        await Cart.updateItem({
            GHCT_Ma: itemToUpdate.GHCT_Ma, // Lấy GHCT_Ma của sản phẩm tìm được
            SoLuong: quantity, // Cập nhật số lượng
        });

        // Bước 4: Cập nhật lại tổng tiền giỏ hàng
        await Cart.updateTotalAmount(cart.GH_Ma);

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
        const cartId = req.params.cartId; // Lấy cartId và itemId từ body (hoặc req.params nếu truyền qua URL)
        const itemId = req.params.itemId;

        // Tìm GHCT_Ma bằng cartId và itemId
        const itemDetails = await Cart.getCartDetails(cartId); // Lấy tất cả chi tiết sản phẩm trong giỏ hàng
        console.log(itemDetails);
        const itemToRemove = itemDetails.find(
            (item) => item.SP_Ma === Number(itemId)
        );
        // Tìm sản phẩm theo mã sản phẩm (SP_Ma)

        if (itemToRemove === 0) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tồn tại trong giỏ hàng.",
            });
        }

        // Xóa sản phẩm khỏi giỏ hàng bằng GHCT_Ma
        await Cart.removeItem(itemToRemove.GHCT_Ma);

        // Cập nhật lại tổng tiền giỏ hàng sau khi xóa sản phẩm
        const cart = await Cart.getCartById(cartId); // Lấy giỏ hàng từ cartId
        await Cart.updateTotalAmount(cart[0].GH_Ma);

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

const clearCart = async (req, res) => {
    try {
        const cartId = req.params.cartId;
        await Cart.clearCart(cartId);

        await Cart.updateTotalAmount(cartId);

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

export default {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    getCartDetails,
    clearCart,
};
