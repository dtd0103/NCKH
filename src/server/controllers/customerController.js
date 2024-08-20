import Customer from "../models/customerModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const customerRegister = async function (req, res) {
    try {
        const { name, username, password, phone, address } = req.body;

        const hashedPassword = await bcrypt.hash(password);
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
        });
        
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            let errorMessage = "Thông tin tài khoản đã tồn tại.";

            if (err.sqlMessage.includes("KH_Username")) {
                errorMessage = "Username đã tồn tại.";
            } else if (error.sqlMessage.includes("KH_SoDienThoai")) {
                errorMessage = "Số điện thoại đã được sử dụng.";
            }

            return res.status(400).send(errorMessage);
        }

        return res.status(500).json({
            message: "Lỗi trong quá trình đăng ký người dùng mới",
            error,
        });
    }
};

const customerLogin = async function (req, res) {
    try {
        const { username, password } = req.body;

        const customer = await Customer.findCustomerByUsername(username);
        if (!customer) {
            return res
                .status(400)
                .json({ message: "Sai thông tin đăng nhập." });
        }

        const validPassword = await bcrypt.compare(
            password,
            customer.KH_Password
        );

        if (!validPassword) {
            return res
                .status(400)
                .json({ message: "Sai thông tin đăng nhập." });
        }

        const token = jwt.sign({ id: customer.KH_Ma }, "your_jwt_secret", {
            expiresIn: "1h",
        });

        res.status(200).json({ message: "Đăng nhập thành công.", token });
    } catch (err) {
        res.status(500).json({
            message: "Có lỗi trong quá trình đăng nhập.",
            error,
        });
    }
};

export default {
    customerRegister,
    customerLogin,
};
