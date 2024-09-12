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
                "INSERT INTO don_hang (DH_Ma, KH_Ma, TongTien) VALUES (?, ? ,?)",
                [data.orderId, data.userId, data.total],
                (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results);
                }
            );
        });
    }

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
            if (data.total) {
                updateFields.push("TongTien = ?");
                values.push(data.total);
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

            connection.query(query, values, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
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
}

export default Order;
