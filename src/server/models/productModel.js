import connection from "../services/mysqlConnection.js";

class Product {
  static getAll() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM san_pham", (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM san_pham s JOIN danh_muc d on d.DM_Ma = s.DM_Ma JOIN thuong_hieu t ON s.TH_Ma = t.TH_Ma  WHERE SP_Ma = ?",
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

  static getByCategory(categoryId) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM san_pham s JOIN danh_muc d on d.DM_Ma = s.DM_Ma WHERE s.DM_Ma = ?",
        [categoryId],
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
      const productName = `%${name}%`;
      connection.query(
        "SELECT * FROM san_pham WHERE SP_Ten LIKE ?",
        [productName],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  static create(data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO san_pham (SP_Ma, SP_Ten, SP_HinhAnh, SP_SoLuong, SP_ThongTin, DM_Ma, DMP_Ma, TH_Ma) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          data.id,
          data.name,
          data.image,
          data.quantity,
          data.desc,
          data.categoryId,
          data.subCategoryId || null, // Nếu data.subCategoryId là null thì sẽ truyền null
          data.brandId,
        ],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  static update(data) {
    return new Promise((resolve, reject) => {
      const query = `
                UPDATE san_pham
                SET
                    SP_Ten = ?,
                    SP_HinhAnh = ?,
                    SP_SoLuong = ?,
                    SP_ThongTin = ?,
                    DM_Ma = ?,
                    DMP_Ma = ?,
                    TH_Ma = ?
                WHERE SP_Ma = ?;
            `;
      const values = [
        data.name,
        data.image,
        data.quantity,
        data.desc,
        data.categoryId,
        data.subCategoryId || null, // Nếu data.subCategoryId là null thì sẽ truyền null
        data.brandId,
        data.id,
      ];

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
      const query = "DELETE FROM san_pham WHERE SP_Ma = ?";

      connection.query(query, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}

export default Product;
