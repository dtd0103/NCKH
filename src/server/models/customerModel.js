import connection from "../services/mysqlConnection.js";

class Customer {
    static getAll() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM khach_hang", (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static createCustomerAccount(data) {
        return new Promise((resolve, reject) => {
            connection.query(
                "INSERT INTO khach_hang (KH_Ten, KH_TaiKhoan, KH_MatKhau, KH_SoDienThoai, KH_DiaChi) VALUES (?, ?, ?, ?, ?)",
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

    static findCustomerByUsername(username) {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM khach_hang WHERE KH_TaiKhoan = ?",
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
                "UPDATE khach_hang SET KH_Ten = ?, KH_TaiKhoan = ?, KH_MatKhau = ?, KH_SoDienThoai = ?, KH_DiaChi = ? WHERE KH_Ma = ?",
                [
                    data.name,
                    data.username,
                    data.password,
                    data.phone,
                    data.address,
                    data.id,
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

    static delete(id) {
        return new Promise((resolve, reject) => {
            connection.query(
                "DELETE FROM khach_hang WHERE KH_Ma = ?",
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

export default Customer;
