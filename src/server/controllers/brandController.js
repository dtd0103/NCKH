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

const getBrandById = async function (req, res) {
    try {
        
        const brand = await Brand.getById(req.params.brandId);
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
        // Kiểm tra xem hình ảnh có được tải lên không
        if (!req.file) {
            return res
                .status(400)
                .json({ message: "Vui lòng tải lên hình ảnh cho danh mục!" });
        }

        const imagePath = `${req.file.filename}`;

        const brandData = {
            ...req.body,
            image: imagePath, // Thêm đường dẫn hình ảnh vào dữ liệu danh mục
        };

        const newBrand = await Brand.create(brandData);
        res.status(201).json(newBrand);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình tạo thương hiệu mới.");
    }
};

const updateBrand = async function (req, res) {
    try {
        const existingBrand = await Brand.getById(req.params.id);
        if (!existingBrand) {
            return res
                .status(404)
                .json({ message: "Thương hiệu không tồn tại" });
        }

        let imagePath = existingBrand.TH_HinhAnh; // Mặc định giữ ảnh cũ
        if (req.file) {
            imagePath = `${req.file.filename}`; // Sử dụng ảnh mới nếu có
        }

        // Tạo dữ liệu cần cập nhật
        const updatedData = {
            ...req.body, // Giữ nguyên các trường khác
            ...(imagePath && { image: imagePath }), // Chỉ thêm trường `image` nếu có file
        };

        const updatedBrand = await Brand.update(updatedData, req.params.id);
        res.status(200).json(updatedBrand);
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
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand,
};
