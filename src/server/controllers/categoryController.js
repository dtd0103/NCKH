import Category from "../models/categoryModel.js";

const getAllCategory = async function (req, res) {
    try {
        const categories = await Category.getAll(); // Assuming getAll returns a Promise
        res.json(categories);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình lấy thông tin danh mục.");
    }
};

const getCategory = async function (req, res) {
    try {
        const category = await Category.get(req.params.name);
        if (category) {
            res.json(category);
        } else {
            res.status(404).send("Danh mục không tồn tại.");
        }
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình lấy thông tin danh mục.");
    }
};

const createCategory = async function (req, res) {
    try {
        // Kiểm tra xem hình ảnh có được tải lên không
        if (!req.file) {
            return res
                .status(400)
                .json({ message: "Vui lòng tải lên hình ảnh cho danh mục!" });
        }

        // Lấy đường dẫn hình ảnh
        const imagePath = `/images/categories/${req.file.filename}`;

        // Thêm đường dẫn hình ảnh vào dữ liệu danh mục
        const categoryData = {
            ...req.body,
            image: imagePath, // Thêm đường dẫn hình ảnh vào dữ liệu danh mục
        };

        // Tạo danh mục mới trong cơ sở dữ liệu
        const newCategory = await Category.create(categoryData);

        // Trả về danh mục mới đã tạo
        res.status(201).json(newCategory);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình tạo danh mục mới.");
    }
};

const updateCategory = async function (req, res) {
    try {
        const updatedCategory = await Category.update(req.body);
        res.json(updatedCategory);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình cập nhật danh mục");
    }
};

const deleteCategory = async function (req, res) {
    try {
        await Category.delete(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình xóa danh mục.");
    }
};

export default {
    getAllCategory,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
};
