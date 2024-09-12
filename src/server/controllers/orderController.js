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
        const { orderId, userId, items } = req.body;

        let total = 0;
        items.forEach((item) => {
            total += item.price * item.quantity;
        });

        const data = {
            orderId,
            userId,
            total,
        };

        const result = await OrderModel.create(data);

        res.status(201).json({
            success: true,
            message: "Đơn hàng được tạo thành công.",
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
        const updatedOrder = await Order.get(req.body);
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

export default {
    getAllOrder,
    getOrder,
    orderCreate,
    orderUpdate,
    orderDelete,
};
