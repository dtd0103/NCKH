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
                [data.id, data.name, data.image, data.categoryId],
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
                "UPDATE danh_muc_phu SET DMP_Ten = ?, DMP_HinhAnh = ? WHERE DMP_Ma = ?";

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
            connection.beginTransaction((err) => {
                if (err) {
                    return reject(err);
                }

                connection.query(
                    "DELETE FROM dh_chitiet WHERE SP_Ma IN (SELECT SP_Ma FROM san_pham WHERE DMP_Ma = ?)",
                    [id],
                    (error, results) => {
                        if (error) {
                            return connection.rollback(() => reject(error));
                        }

                        connection.query(
                            "DELETE FROM san_pham WHERE DMP_Ma = ?",
                            [id],
                            (error, results) => {
                                if (error) {
                                    return connection.rollback(() =>
                                        reject(error)
                                    );
                                }

                                connection.query(
                                    "DELETE FROM danh_muc_phu WHERE DMP_Ma = ?",
                                    [id],
                                    (error, results) => {
                                        if (error) {
                                            return connection.rollback(() =>
                                                reject(error)
                                            );
                                        }

                                        connection.commit((err) => {
                                            if (err) {
                                                return connection.rollback(() =>
                                                    reject(err)
                                                );
                                            }
                                            resolve(results);
                                        });
                                    }
                                );
                            }
                        );
                    }
                );
            });
        });
    }
}

export default SubCategory;
