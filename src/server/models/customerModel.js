import connection from "../services/mysqlConnection.js";

class Customer {
    static createCustomerAccount(data) {
        return new Promise((resolve, reject) => {
            connection.query(
                "INSERT INTO khach_hang (KH_Ten, KH_Username, KH_Password, KH_SoDienThoai, KH_DiaChi) VALUES (?, ?, ?, ?, ?)",
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
                "SELECT * FROM khach_hang WHERE KH_Username = ?",
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
}

export default Customer;
