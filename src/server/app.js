import express from "express";
import mysql from "mysql";
import cors from "cors";
import brandRouter from "./routes/brandRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import customerRouter from "./routes/customerRoute.js";
import subCategoryRouter from "./routes/subCategoryRoute.js";
import employeeRouter from "./routes/employeeRoute.js";
import productRouter from "./routes/productRoute.js";

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

app.use(express.json());

app.use("/api", categoryRouter);
app.use("/api", subCategoryRouter);
app.use("/api", customerRouter);
app.use("/api", brandRouter);
app.use("/api", employeeRouter);
app.use("/api", productRouter);

app.listen(8081, () => {
    console.log("Listening");
});
