import Order from "../models/orderModel.js";

const getAllOrder = async function (req, res) {
    try {
        const orders = await Order.getAll();
        res.status(200).json(orders);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình lấy thông tin đơn hàng.");
    }
};

const getOrder = async function (req, res) {
    try {
        const order = await Order.get(req.params.id);
        res.status(200).json(order);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình lấy thông tin đơn hàng.");
    }
};

const orderCreate = async function (req, res) {
  try {
    const { userId, items } = req.body;

    let total = 0;
    items.forEach((item) => {
      total += item.price * item.quantity;
    });

    // Cộng phí ship vào tổng giá trị đơn hàng
    const shippingFee = 10; // Phí ship cố định là 10
    total += shippingFee; // Cộng thêm phí ship vào tổng giá trị đơn hàng

    const orderData = {
      userId,
      total,
    };

    const result = await Order.create(orderData);
    console.log(result);
    const orderId = result.insertId;

    const orderDetails = items.map((item) => {
      return {
        DH_Ma: orderId,
        SP_Ma: item.productId,
        SoLuong: item.quantity,
        DonGia: item.price,
      };
    });

    await Order.createDetail(orderDetails);

    res.status(201).json({
      success: true,
      message: "Đơn hàng và chi tiết đơn hàng được tạo thành công.",
      orderId: orderId,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi trong quá trình tạo đơn hàng mới.",
      error: error.message,
    });
  }
};


const orderUpdate = async function (req, res) {
    try {
        const updatedOrder = await Order.update(req.body);
        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send(
            "Lỗi trong quá trình cập nhật thông tin đơn hàng."
        );
    }
};

const orderDelete = async function (req, res) {
    try {
        await Order.delete(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình xóa đơn hàng.");
    }
};

const getOrdersByCusId = async function (req, res) {
    try {
        const customerId = req.params.customerId;

        const orders = await Order.getByCustomerId(customerId);
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng nào cho khách hàng này.",
            });
        }

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).json({
            success: false,
            message: "Lỗi trong quá trình lấy danh sách đơn hàng.",
            error: err.message,
        });
    }
    
};
const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const orderDetails = await Order.getOrderDetails(orderId);

    if (!orderDetails || orderDetails.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chi tiết đơn hàng." });
    }

    res.status(200).json({ data: orderDetails });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ." });
  }
};

export default {
  getAllOrder,
  getOrder,
  orderCreate,
  orderUpdate,
  orderDelete,
  getOrdersByCusId,
  getOrderDetails,
};
