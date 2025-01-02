import Employee from "../models/employeeModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getAllEmployee = async function (req, res) {
  try {
    const allEmployee = await Employee.getAll();
    res.status(200).json(allEmployee);
  } catch (err) {
    console.error("Lỗi truy vấn: " + err.message);
    res.status(500).send("Lỗi trong quá trình lấy thông tin nhân viên.");
  }
};

const getEmployeeById = async function (req, res) {
  try {
    console.log(req.params.id);
    const employee = await Employee.findEmployeeById(req.params.id);
    res.status(200).json(employee);
  } catch (err) {
    console.error("Lỗi truy vấn: " + err.message);
    res.status(500).send("Lỗi trong quá trình lấy thông tin nhân viên.");
  }
};

const getEmployee = async function (req, res) {
  try {
    const employee = await Employee.findEmployeeByUsername(req.params.username);
    res.status(200).json(employee);
  } catch (err) {
    console.error("Lỗi truy vấn: " + err.message);
    res.status(500).send("Lỗi trong quá trình lấy thông tin nhân viên.");
  }
};

const employeeCreate = async function (req, res) {
  try {
    const { name, username, password, phone, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const employeeData = {
      name,
      username,
      password: hashedPassword,
      phone,
      address,
    };

    const newEmployee = await Employee.createEmployeeAccount(employeeData);

    res.status(201).json({
      message: "Thêm tài khoản nhân viên thành công",
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
      message: "Lỗi trong quá trình đăng ký tài khoản nhân viên mới",
      err: err.message,
    });
  }
};

const employeeLogin = async function (req, res) {
  try {
    const { username, password } = req.body;

    const employee = await Employee.findEmployeeByUsername(username);

    const validPassword = await bcrypt.compare(password, employee.NV_MatKhau);

    if (!validPassword) {
      return res.status(400).json({
        message: "Sai thông tin đăng nhập.",
      });
    }

    const token = jwt.sign(
      {
        id: employee.NV_Ma,
        role: "admin",
        username: employee.NV_TaiKhoan,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3h",
      }
    );

    res.status(200).json({
      message: "Đăng nhập thành công.",
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Có lỗi trong quá trình đăng nhập.",
      error: err.message,
    });
  }
};

const employeeUpdate = async function (req, res) {
  try {
    const updatedEmployee = await Employee.update(req.body);
    res.json(updatedEmployee);
  } catch (err) {
    console.error("Lỗi truy vấn: " + err.message);
    res.status(500).send("Lỗi trong quá trình cập nhật thông tin nhân viên.");
  }
};

const employeeDelete = async function (req, res) {
  try {
    await Employee.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error("Lỗi truy vấn: " + err.message);
    res.status(500).send("Lỗi trong quá trình xóa tài khoản nhân viên.");
  }
};

export default {
  getAllEmployee,
  getEmployee,
  getEmployeeById,
  employeeCreate,
  employeeLogin,
  employeeUpdate,
  employeeDelete,
};
