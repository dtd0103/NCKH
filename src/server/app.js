import express  from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "dtdat020103",
    database: "nckh_dtb",
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        process.exit(1); // Dừng ứng dụng nếu kết nối không thành công
    }
    console.log("Connected to the database.");
});

app.get("/", (req, res) => {
    const sql = "SELECT * FROM danh_muc";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

app.listen(8081, () => {
    console.log("listening");
});
