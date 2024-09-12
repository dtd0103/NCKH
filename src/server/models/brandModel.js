import connection from "../services/mysqlConnection.js";

class Brand {
    static getAll() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM thuong_hieu", (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static get(name) {
        return new Promise((resolve, reject) => {
            const brandName = `%${name}%`;
            connection.query(
                "SELECT * FROM thuong_hieu WHERE TH_Ten LIKE ?",
                [brandName],
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
            const query =
                "INSERT INTO thuong_hieu (TH_Ma, TH_Ten, TH_HinhAnh) VALUES (?, ?, ?)";
            connection.query(
                query,
                [data.id, data.ten, data.hinh_anh],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                }
            );
        });
    }

    static update(data) {
        return new Promise((resolve, reject) => {
            const query =
                "UPDATE thuong_hieu SET TH_Ten = ?, TH_HinhAnh = ? WHERE TH_Ma = ?";
            connection.query(
                query,
                [data.ten, data.hinh_anh, data],
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
            const query = "DELETE FROM thuong_hieu WHERE TH_Ma = ?";
            connection.query(query, [id], (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(results);
            });
        });
    }
}

export default Brand;
