import SubCategory from "../models/subCategoryModel.js";

const getAllSubCategory = async function (req, res) {
    try {
        const categories = await SubCategory.getAll(); // Assuming getAll returns a Promise
        res.json(categories);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình lấy thông tin danh mục phụ.");
    }
};

const getSubCategory = async function (req, res) {
    try {
        const subCategory = await SubCategory.get(req.params.name);
        if (subCategory) {
            res.json(subCategory);
        } else {
            res.status(404).send("Danh mục phụ không tồn tại.");
        }
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình lấy thông tin danh mục phụ.");
    }
};

const createSubCategory = async function (req, res) {
    try {
        const newSubCategory = await SubCategory.create(req.body);
        res.status(201).json(newSubCategory);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình tạo danh mục phụ mới.");
    }
};

const updateSubCategory = async function (req, res) {
    try {
        const updatedSubCategory = await SubCategory.update(req.body);
        res.json(updateSubCategory);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình cập nhật danh mục phụ.");
    }
};

const deleteSubCategory = async function (req, res) {
    try {
        await SubCategory.delete(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình xóa danh mục phụ.");
    }
};

export default {
    getAllSubCategory,
    getSubCategory,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
};
