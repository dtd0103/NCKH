import connection from "../services/mysqlConnection.js";

class Category {
    static getAll() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM danh_muc", (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static get(name) {
        return new Promise((resolve, reject) => {
            const categoryName = `%{name}%`;
            connection.query(
                "SELECT * FROM danh_muc WHERE DM_Ten = ?",
                [categoryName],
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
                "INSERT INTO danh_muc (DM_Ma, DM_Ten, DM_HinhAnh) VALUES (?, ?, ?)";
            connection.query(
                query,
                [data.id, data.name, data.image],
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
                "UPDATE danh_muc SET DM_Ten = ?, DM_HinhAnh = ? WHERE DM_Ten = ?";
            connection.query(
                query,
                [data.name, data.image, data.id],
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
                "DELETE FROM danh_muc WHERE DM_Ma = ?",
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

export default Category;
