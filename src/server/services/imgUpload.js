import multer from "multer";
import path from "path";

const categoryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/categories"); // Lưu vào thư mục "images/categories"
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Tên file gồm timestamp + đuôi file gốc
    },
});

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/products"); // Lưu vào thư mục "images/products"
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Tên file gồm timestamp + đuôi file gốc
    },
});

const brandStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/brands"); // Lưu vào thư mục "images/brands"
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Tên file gồm timestamp + đuôi file gốc
    },
});

const uploadCategory = multer({
    storage: categoryStorage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimeType = fileTypes.test(file.mimetype);
        if (extname && mimeType) {
            return cb(null, true);
        } else {
            cb(new Error("Chỉ cho phép tải lên hình ảnh!"), false);
        }
    },
}).single("image"); // Chỉ cho phép 1 file với tên "image" từ form

const uploadProduct = multer({
    storage: productStorage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimeType = fileTypes.test(file.mimetype);
        if (extname && mimeType) {
            return cb(null, true);
        } else {
            cb(new Error("Chỉ cho phép tải lên hình ảnh!"), false);
        }
    },
}).single("image"); // Chỉ cho phép 1 file với tên "image" từ form

const uploadBrand = multer({
    storage: brandStorage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimeType = fileTypes.test(file.mimetype);
        if (extname && mimeType) {
            return cb(null, true);
        } else {
            cb(new Error("Chỉ cho phép tải lên hình ảnh!"), false);
        }
    },
}).single("image"); // Chỉ cho phép 1 file với tên "image" từ form

export { uploadCategory, uploadProduct, uploadBrand };
