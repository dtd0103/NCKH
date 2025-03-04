import Product from "../models/productModel.js";
import redisClient from "../services/redisClient.js";

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

const getProductByCategoryId = async function (req, res) {
    try {
        const products = await Product.getByCategory(req.params.categoryId);
        res.json(products);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send(
            "Lỗi trong quá trình lấy thông tin sản phẩm theo danh mục."
        );
    }
};

const getProductById = async function (req, res) {
    try {
        const product = await Product.getById(req.params.id);
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

const getProductsByIds = async (req, res) => {
    try {
        const { productIds } = req.body;

        if (!Array.isArray(productIds) || productIds.length === 0) {
            return res
                .status(400)
                .json({ message: "Danh sách ID không hợp lệ" });
        }

        const products = await Product.getByIds(productIds);

        res.json({
            products: products,
        });
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        res.status(500).json({
            message: "Có lỗi xảy ra",
            error: error.message,
        });
    }
};

const createProduct = async function (req, res) {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ message: "Vui lòng tải lên hình ảnh cho sản phẩm!" });
        }

        const imagePath = `${req.file.filename}`;

        const productData = {
            ...req.body,
            image: imagePath,
        };

        const newProduct = await Product.create(productData);

        res.status(201).json(newProduct);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình tạo sản phẩm mới.");
    }
};

const updateProduct = async function (req, res) {
    try {
        console.log("Body:", req.body); // Kiểm tra body
        console.log("File:", req.file); // Kiểm tra file

        const existingProduct = await Product.getById(req.params.id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        let imagePath = existingProduct.SP_HinhAnh; // Mặc định giữ ảnh cũ
        if (req.file) {
            imagePath = `${req.file.filename}`; // Sử dụng ảnh mới nếu có
        }

        const updatedData = {
            ...req.body, // Giữ nguyên các trường khác
            ...(imagePath && { image: imagePath }), // Chỉ thêm trường `image` nếu có file
        };

        const updatedProduct = await Product.update(updatedData, req.params.id);

        res.status(200).json(updatedProduct);
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

// const productView = async function (req, res) {
//     console.log("Request body received:", req.body);
//     console.log("Server Session ID:", req.sessionID);

//     const { productId } = req.body;

//     try {
//         const sessionId = req.sessionID;

//         const viewedProducts = await redisClient.hGetAll(
//             `viewedProducts:${sessionId}`
//         );

//         if (!viewedProducts || Object.keys(viewedProducts).length === 0) {
//             await redisClient.hSet(`viewedProducts:${sessionId}`, productId, 1);
//         } else {
//             const currentViewCount = viewedProducts[productId] || 0;
//             if (currentViewCount < 6) {
//                 await redisClient.hSet(
//                     `viewedProducts:${sessionId}`,
//                     productId,
//                     parseInt(currentViewCount) + 1
//                 );
//             }

//             console.log("Cookies received:", req.cookies); // Kiểm tra nếu cookie từ client không được gửi
//             console.log("Session Data:", req.session); // Kiểm tra session có hoạt động không
//             res.json({
//                 message: `Sản phẩm với id ${productId} đã được thêm vào danh sách sản phẩm đã xem.`,
//                 viewedProducts: viewedProducts,
//             });
//         }
//     } catch (err) {
//         res.status(500).json({ message: "Có lỗi xảy ra.", error: err.message });
//     }
// };

const productView = async function (req, res) {
    console.log("Request body received:", req.body);

    const { productId, userId } = req.body; // Nhận userId từ request body
    const isAuthenticated = !!userId; // Kiểm tra xem người dùng có đăng nhập không

    if (!userId) {
        return res.status(400).json({ message: "UserId is required" }); // Kiểm tra xem userId có được cung cấp không
    }

    try {
        // Key Redis cho người dùng đã đăng nhập
        const key = `viewedProducts:${userId}`;

        // Lấy danh sách sản phẩm đã xem từ Redis
        const viewedProducts = await redisClient.lRange(key, 0, -1);

        // Nếu sản phẩm chưa được lưu
        if (!viewedProducts.includes(productId)) {
            // Thêm sản phẩm vào danh sách
            await redisClient.rPush(key, productId);

            // Giới hạn danh sách tối đa 6 sản phẩm
            const productCount = await redisClient.lLen(key);
            if (productCount > 6) {
                await redisClient.lPop(key); // Xóa sản phẩm cũ nhất
            }
        }

        // Lấy danh sách sản phẩm đã xem sau khi cập nhật
        const updatedViewedProducts = await redisClient.lRange(key, 0, -1);

        res.json({
            message: `Sản phẩm với id ${productId} đã được thêm vào danh sách sản phẩm đã xem.`,
            viewedProducts: updatedViewedProducts,
        });
    } catch (err) {
        res.status(500).json({ message: "Có lỗi xảy ra.", error: err.message });
    }
};

const getViewedProducts = async function (req, res) {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "UserId is required" });
    }

    try {
        const key = `viewedProducts:${userId}`;

        // Lấy danh sách ID sản phẩm đã xem từ Redis
        const productIds = await redisClient.lRange(key, 0, -1);

        if (productIds.length === 0) {
            return res.json({
                message: "Không có sản phẩm nào.",
                productIds: [],
            });
        }

        res.json({
            message: `Danh sách ID sản phẩm đã xem của user ${userId}.`,
            productIds: productIds, // Chỉ trả về danh sách ID
        });
    } catch (err) {
        res.status(500).json({ message: "Có lỗi xảy ra.", error: err.message });
    }
};

export default {
    getAllProduct,
    getProduct,
    getProductById,
    getProductsByIds,
    getProductByCategoryId,
    createProduct,
    updateProduct,
    deleteProduct,
    productView,
    getViewedProducts,
};
