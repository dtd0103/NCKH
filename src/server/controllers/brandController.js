import Brand from "../models/brandModel.js";

const getAllBrand = async function (req, res) {
    try {
        const brands = await Brand.getAll();
        res.json(brands);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình lấy thông tin thương hiệu.");
    }
};

const getBrand = async function (req, res) {
    try {
        const brand = await Brand.get(req.params.name);
        if (brand) {
            res.json(brand);
        } else {
            res.status(404).send("Danh mục không tồn tại.");
        }
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình lấy thông tin thương hiệu.");
    }
};

const createBrand = async function (req, res) {
    try {
        const newBrand = await Brand.create(req.body);
        res.status(201).json(newBrand);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình tạo thương hiệu mới.");
    }
};

const updateBrand = async function (req, res) {
    try {
        const updatedBrand = await Brand.update(req.body);
        res.json(updatedBrand);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send(
            "Lỗi trong quá trình cập nhật thông tin thương hiệu."
        );
    }
};

const deleteBrand = async function (req, res) {
    try {
        await Brand.delete(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình xóa thương hiệu.");
    }
};

export default {
    getAllBrand,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
};
