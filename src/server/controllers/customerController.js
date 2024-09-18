import Customer from "../models/customerModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connection from "../services/mysqlConnection.js";

const getAllCustomer = async function (req, res) {
    try {
        const customers = await Customer.getAll();
        res.status(200).json(customers);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình lấy thông tin người dùng.");
    }
};

const getCustomer = async function (req, res) {
    try {
        const employee = await Customer.findCustomerByUsername(
            req.params.username
        );
        res.status(200).json(employee);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình lấy thông tin khách hàng.");
    }
};

const customerRegister = async function (req, res) {
    try {
        const { name, username, password, phone, address } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const customerData = {
            name,
            username,
            password: hashedPassword,
            phone,
            address,
        };

        const newCustomer = await Customer.createCustomerAccount(customerData);

        res.status(201).json({
            message: "Đăng ký tài khoản thành công",
            customer: newCustomer,
            redirectUrl: "/index.html",
        });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            let errorMessage = "Thông tin tài khoản đã tồn tại.";

            if (err.sqlMessage.includes("KH_Username")) {
                errorMessage = "Username đã tồn tại.";
            } else if (err.sqlMessage.includes("KH_SoDienThoai")) {
                errorMessage = "Số điện thoại đã được sử dụng.";
            }

            return res.status(400).send(errorMessage);
        }

        return res.status(500).json({
            message: "Lỗi trong quá trình đăng ký người dùng mới",
            err: err.message,
        });
    }
};

const customerLogin = async function (req, res) {
    try {
        console.log("Request body:", req.body);
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ tài khoản và mật khẩu.",
            });
        }

        const customer = await Customer.findCustomerByUsername(username);
        if (!customer) {
            return res
                .status(400)
                .json({ message: "Tài khoản không tồn tại." });
        }

        console.log("Customer from DB:", customer);

        const passwordMatch = await bcrypt.compare(
            password,
            customer.KH_MatKhau
        );
        console.log("Password match result:", passwordMatch);

        if (!passwordMatch) {
            return res.status(400).json({ message: "Sai mật khẩu." });
        }

        const token = jwt.sign({ id: customer.KH_Ma }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        req.session.userId = customer.KH_Ma;

        res.status(200).json({
            message: "Đăng nhập thành công.",
            token: token,
            sessionId: req.session.id,
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            message: "Có lỗi trong quá trình đăng nhập.",
            error: err.message,
        });
    }
};

const customerLogout = async function (req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Không thể đăng xuất." });
        }

        res.status(200).json({ message: "Đăng xuất thành công." });
    });
};

const updateCustomer = async function (req, res) {
    try {
        const updatedCustomer = await Customer.update(req.body);
        res.json(updatedCustomer);
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send(
            "Lỗi trong quá trình cập nhật thông tin khách hàng."
        );
    }
};

const deleteCustomer = async function (req, res) {
    try {
        await Customer.delete(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error("Lỗi truy vấn: " + err.message);
        res.status(500).send("Lỗi trong quá trình xóa tài khoản khách hàng.");
    }
};

export default {
    getAllCustomer,
    getCustomer,
    customerRegister,
    customerLogin,
    customerLogout,
    updateCustomer,
    deleteCustomer,
};
