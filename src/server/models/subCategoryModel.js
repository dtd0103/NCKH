import connection from "../services/mysqlConnection.js";

class SubCategory {
    static getAll() {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM danh_muc_phu JOIN danh_muc ON danh_muc_phu.DM_Ma = danh_muc.DM_Ma",
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                }
            );
        });
    }

    static get(name) {
        return new Promise((resolve, reject) => {
            const subCategoryName = `%${name}%`;
            connection.query(
                "SELECT * FROM danh_muc_phu WHERE DMP_Ten = ?",
                [subCategoryName],
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
                "INSERT INTO danh_muc_phu (DMP_Ma, DMP_Ten, DMP_HinhAnh, DM_Ma) VALUES (?, ?, ?, ?)";
            connection.query(
                query,
                [data.id, data.ten, data.hinh_anh, data.categoryId],
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
                "UPDATE danh_muc_phu SET DMP_Ma = ?, DMP_Ten = ?, DMP_HinhAnh = ? WHERE DMP_Ma = ?";

            connection.query(
                query,
                [data.id, data.ten, data.hinh_anh, data.id],
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
            const query = "DELETE FROM danh_muc_phu WHERE DMP_Ma = ?";
            connection.query(query, [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

export default SubCategory;
