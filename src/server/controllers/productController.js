import Product from "../models/productModel.js";

const getAllProduct = async function (req, res) {
    try {
        const products = await Product.getAll();
        res.json(products);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình lấy thông tin sản phẩm.");
    }
};

const getProduct = async function (req, res) {
    try {
        const product = await Product.get(req.params.name);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send("Sản phẩm không tồn tại.");
        }
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình lấy thông tin sản phẩm.");
    }
};

const createProduct = async function (req, res) {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình tạo sản phẩm mới.");
    }
};

const updateProduct = async function (req, res) {
    try {
        const updatedProduct = await Product.update(req.body);
        res.json(updateProduct);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send(
            "Lỗi trong quá trình cập nhật thông tin sản phẩm."
        );
    }
};

const deleteProduct = async function (req, res) {
    try {
        await Product.delete(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình xóa sản phẩm.");
    }
};

export default {
    getAllProduct,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};
