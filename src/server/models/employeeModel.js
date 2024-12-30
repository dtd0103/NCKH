import connection from "../services/mysqlConnection.js";

class Employee {
    static getAll() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM nhan_vien", (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static createEmployeeAccount(data) {
        return new Promise((resolve, reject) => {
            connection.query(
                "INSERT INTO nhan_vien (NV_Ten, NV_TaiKhoan, NV_MatKhau, NV_SoDienThoai, NV_DiaChi) VALUES (?, ?, ?, ?, ?)",
                [
                    data.name,
                    data.username,
                    data.password,
                    data.phone,
                    data.address,
                ],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                }
            );
        });
    }

    static findEmployeeById(id) {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM nhan_vien WHERE NV_TaiKhoan = ?",
                [id],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results[0]);
                }
            );
        });
    }

    static findEmployeeByUsername(username) {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM nhan_vien WHERE NV_TaiKhoan = ?",
                [username],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results[0]);
                }
            );
        });
    }

    static update(data) {
        return new Promise((resolve, reject) => {
            connection.query(
                "UPDATE nhan_vien SET NV_Ten = ?, NV_TaiKhoan = ?, NV_SoDienThoai = ?, NV_DiaChi = ? WHERE NV_Ma = ?",
                [data.name, data.username, data.phone, data.address, data.id],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                }
            );
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            connection.query(
                "DELETE FROM nhan_vien WHERE NV_Ma = ?",
                [id],
                (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results);
                }
            );
        });
    }
}

export default Employee;
