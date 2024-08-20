import mysql from 'mysql'

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "dtdat020103",
    database: "nckh_dtb",
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        process.exit(1); // Dừng ứng dụng nếu kết nối không thành công
    }
    console.log("Connected to the database.");
});

export default connection;

