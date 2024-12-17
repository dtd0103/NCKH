import connection from "../services/mysqlConnection.js";

class Cart {
  // Lấy thông tin tất cả giỏ hàng
  static getAll() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM gio_hang", (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  // Lấy thông tin một giỏ hàng theo ID
  static get(cartId) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM gio_hang WHERE GH_Ma = ?",
        [cartId],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results[0]);
        }
      );
    });
  }

  // Tạo mới một giỏ hàng
  static create(customerId) {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO gio_hang (KH_Ma) VALUES (?)",
        [customerId],
        (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }
  static updateCart(cartId, customerId) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE gio_hang SET KH_Ma = ? WHERE GH_Ma = ?";
      connection.query(query, [customerId, cartId], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }
  // Thêm sản phẩm vào giỏ hàng
  static addItemToCart(data) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO gio_hang_chitiet (GH_Ma, SP_Ma, SoLuong, DonGia) VALUES (?, ?, ?, ?)`;
      connection.query(
        query,
        [data.GH_Ma, data.SP_Ma, data.SoLuong, data.DonGia],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  // Lấy danh sách sản phẩm trong giỏ hàng
  static getCartItems(cartId) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM gio_hang_chitiet WHERE GH_Ma = ?`,
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

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  static updateCartItem(itemId, data) {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE gio_hang_chitiet SET SoLuong = ?, DonGia = ? WHERE GHCT_Ma = ?`,
        [data.SoLuong, data.DonGia, itemId],
        (err, results) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }

  // Xóa một sản phẩm trong giỏ hàng
  static deleteCartItem(itemId) {
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

  // Xóa toàn bộ giỏ hàng và chi tiết
  static delete(cartId) {
    return new Promise((resolve, reject) => {
      connection.beginTransaction((err) => {
        if (err) return reject(err);

        // Xóa chi tiết giỏ hàng trước
        connection.query(
          "DELETE FROM gio_hang_chitiet WHERE GH_Ma = ?",
          [cartId],
          (err) => {
            if (err) {
              return connection.rollback(() => reject(err));
            }

            // Xóa giỏ hàng
            connection.query(
              "DELETE FROM gio_hang WHERE GH_Ma = ?",
              [cartId],
              (err, results) => {
                if (err) {
                  return connection.rollback(() => reject(err));
                }
                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => reject(err));
                  }
                  resolve(results);
                });
              }
            );
          }
        );
      });
    });
  }
}

export default Cart;
