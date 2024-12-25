import connection from "../services/mysqlConnection.js";

class Cart {
    static getByCustomerId(customerId) {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM gio_hang WHERE KH_Ma = ? LIMIT 1",
                [customerId],
                (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results[0]);
                }
            );
        });
    }

    static createCart(customerId) {
        console.log(customerId);
        return new Promise((resolve, reject) => {
            this.getByCustomerId(customerId)
                .then((existingCart) => {
                    if (existingCart) {
                        resolve(existingCart);
                    } else {
                        connection.query(
                            "INSERT INTO gio_hang (KH_Ma) VALUES (?)",
                            [customerId],
                            (err, results) => {
                                if (err) {
                                    reject(err);
                                }
                                resolve({ KH_Ma: customerId });
                            }
                        );
                    }
                })
                .catch(reject);
        });
    }

    static addItem(data) {
        return new Promise((resolve, reject) => {
            // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
            connection.query(
                "SELECT * FROM gio_hang_chitiet WHERE GH_Ma = ? AND SP_Ma = ?",
                [data.GH_Ma, data.SP_Ma],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }

                    if (results.length > 0) {
                        // Cập nhật số lượng nếu sản phẩm đã tồn tại
                        connection.query(
                            "UPDATE gio_hang_chitiet SET SoLuong = SoLuong + ? WHERE GH_Ma = ? AND SP_Ma = ?",
                            [data.SoLuong, data.GH_Ma, data.SP_Ma],
                            (updateErr, updateResults) => {
                                if (updateErr) {
                                    return reject(updateErr);
                                }
                                resolve(updateResults);
                            }
                        );
                    } else {
                        // Thêm sản phẩm mới vào giỏ hàng
                        connection.query(
                            "INSERT INTO gio_hang_chitiet (GH_Ma, SP_Ma, SoLuong, DonGia) VALUES (?, ?, ?, ?)",
                            [data.GH_Ma, data.SP_Ma, data.SoLuong, data.DonGia],
                            (insertErr, insertResults) => {
                                if (insertErr) {
                                    return reject(insertErr);
                                }
                                resolve(insertResults);
                            }
                        );
                    }
                }
            );
        });
    }

    static updateItem(data) {
        return new Promise((resolve, reject) => {
            if (data.SoLuong <= 0) {
                // Nếu số lượng <= 0, xóa sản phẩm khỏi giỏ hàng
                this.removeItem(data.GHCT_Ma).then(resolve).catch(reject);
            } else {
                // Cập nhật số lượng sản phẩm
                connection.query(
                    "UPDATE gio_hang_chitiet SET SoLuong = ? WHERE GHCT_Ma = ?",
                    [data.SoLuong, data.GHCT_Ma],
                    (err, results) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(results);
                    }
                );
            }
        });
    }

    static removeItem(itemId) {
        return new Promise((resolve, reject) => {
            connection.query(
                "DELETE FROM gio_hang_chitiet WHERE GHCT_Ma = ?",
                [itemId],
                (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results);
                }
            );
        });
    }

    static getCartDetails(cartId) {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT ghct.*, sp.SP_Ten, sp.SP_HinhAnh FROM gio_hang_chitiet ghct " +
                    "JOIN san_pham sp ON ghct.SP_Ma = sp.SP_Ma " +
                    "WHERE ghct.GH_Ma = ?",
                [cartId],
                (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results);
                }
            );
        });
    }

    static clearCart(cartId) {
        return new Promise((resolve, reject) => {
            connection.query(
                "DELETE FROM gio_hang_chitiet WHERE GH_Ma = ?",
                [cartId],
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

export default Cart;
