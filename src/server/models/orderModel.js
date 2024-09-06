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

    
}
