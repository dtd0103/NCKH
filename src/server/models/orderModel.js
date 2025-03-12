import connection from "../services/mysqlConnection.js";

class Order {
    static getAll() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM don_hang", (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(results);
            });
        });
    }

    static get(id) {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM don_hang WHERE DH_Ma = ?",
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

    static create(data) {
        return new Promise((resolve, reject) => {
            connection.query(
                "INSERT INTO don_hang (KH_Ma, TongTien) VALUES (? ,?)",
                [data.userId, data.total],
                (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve({ insertId: results.insertId });
                }
            );
        });
    }

    static createDetail(data) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO dh_chitiet (DH_Ma, SP_Ma, SoLuong, DonGia) VALUES ?`;
            const values = data.map((item) => [
                item.DH_Ma,
                item.SP_Ma,
                item.SoLuong,
                item.DonGia,
            ]);

            connection.query(query, [values], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    // static update(data) {
    //   return new Promise((resolve, reject) => {
    //     const updateFields = [];
    //     const values = [];

    //     if (data.state) {
    //       updateFields.push("TrangThai = ?");
    //       values.push(data.state);
    //     }
    //     if (data.deliverDate) {
    //       updateFields.push("NgayGiao = ?");
    //       values.push(data.deliverDate);
    //     }
    //     if (data.total) {
    //       updateFields.push("TongTien = ?");
    //       values.push(data.total);
    //     }

    //     if (updateFields.length === 0) {
    //       reject(new Error("Không có trường nào cần cập nhật."));
    //       return;
    //     }

    //     const query = `
    //               UPDATE don_hang
    //               SET ${updateFields.join(", ")}
    //               WHERE DH_Ma = ?;
    //           `;

    //     values.push(data.DH_Ma);

    //     connection.query(query, values, (err, results) => {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve(results);
    //       }
    //     });
    //   });
    // }

    //

    static update(data) {
        return new Promise((resolve, reject) => {
            const updateFields = [];
            const values = [];

            if (data.state) {
                updateFields.push("TrangThai = ?");
                values.push(data.state);
            }
            if (data.deliverDate) {
                updateFields.push("NgayGiao = ?");
                values.push(data.deliverDate);
            }

            if (updateFields.length === 0) {
                reject(new Error("Không có trường nào cần cập nhật."));
                return;
            }

            const query = `
        UPDATE don_hang
        SET ${updateFields.join(", ")}
        WHERE DH_Ma = ?;
      `;

            values.push(data.DH_Ma);

            // Bắt đầu transaction
            connection.beginTransaction((err) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Cập nhật đơn hàng
                connection.query(query, values, (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            reject(err);
                        });
                    }

                    // Nếu trạng thái là "Đã xác nhận"
                    if (data.state === "Đã xác nhận") {
                        // Chèn vào bảng nv_donhang
                        const insertQuery = `
              INSERT INTO nv_donhang (NV_Ma, DH_Ma)
              VALUES (?, ?);
            `;
                        const insertValues = [data.NV_Ma, data.DH_Ma];

                        connection.query(
                            insertQuery,
                            insertValues,
                            (insertErr) => {
                                if (insertErr) {
                                    return connection.rollback(() => {
                                        reject(insertErr);
                                    });
                                }

                                // Lấy thông tin chi tiết đơn hàng từ bảng dh_chitiet
                                const detailQuery = `
                SELECT SP_Ma, SoLuong
                FROM dh_chitiet
                WHERE DH_Ma = ?;
              `;

                                connection.query(
                                    detailQuery,
                                    [data.DH_Ma],
                                    (detailErr, detailResults) => {
                                        if (detailErr) {
                                            return connection.rollback(() => {
                                                reject(detailErr);
                                            });
                                        }

                                        // Giảm số lượng sản phẩm trong bảng san_pham
                                        const updateProductPromises =
                                            detailResults.map((item) => {
                                                return new Promise(
                                                    (resolve, reject) => {
                                                        const updateProductQuery = `
                      UPDATE san_pham
                      SET SP_SoLuong = SP_SoLuong - ?
                      WHERE SP_Ma = ?;
                    `;
                                                        connection.query(
                                                            updateProductQuery,
                                                            [
                                                                item.SoLuong,
                                                                item.SP_Ma,
                                                            ],
                                                            (updateErr) => {
                                                                if (updateErr) {
                                                                    reject(
                                                                        updateErr
                                                                    );
                                                                } else {
                                                                    resolve();
                                                                }
                                                            }
                                                        );
                                                    }
                                                );
                                            });

                                        // Thực hiện tất cả các cập nhật sản phẩm
                                        Promise.all(updateProductPromises)
                                            .then(() => {
                                                // Commit transaction nếu thành công
                                                connection.commit(
                                                    (commitErr) => {
                                                        if (commitErr) {
                                                            return connection.rollback(
                                                                () => {
                                                                    reject(
                                                                        commitErr
                                                                    );
                                                                }
                                                            );
                                                        }
                                                        resolve({
                                                            message:
                                                                "Cập nhật đơn hàng, chèn vào nv_donhang và giảm số lượng sản phẩm thành công!",
                                                        });
                                                    }
                                                );
                                            })
                                            .catch((error) => {
                                                connection.rollback(() => {
                                                    reject(error);
                                                });
                                            });
                                    }
                                );
                            }
                        );
                    } else {
                        // Nếu không phải trạng thái "Đã xác nhận", chỉ commit cập nhật đơn hàng
                        connection.commit((commitErr) => {
                            if (commitErr) {
                                return connection.rollback(() => {
                                    reject(commitErr);
                                });
                            }
                            resolve(results);
                        });
                    }
                });
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            connection.query(
                "DELETE FROM don_hang WHERE DH_MA = ?",
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

    static getByCustomerId(customerId) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM don_hang WHERE KH_Ma = ?";
            connection.query(query, [customerId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
    static getOrderDetails(orderId) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM dh_chitiet WHERE DH_Ma = ?";
            connection.query(query, [orderId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

export default Order;
