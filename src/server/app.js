import express from "express";
import cors from "cors";
import session from "express-session";
import RedisStore from "connect-redis";
import redisClient from "./services/redisClient.js";

import brandRouter from "./routes/brandRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import customerRouter from "./routes/customerRoute.js";
import subCategoryRouter from "./routes/subCategoryRoute.js";
import employeeRouter from "./routes/employeeRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import cartRouter from "./routes/cartRoute.js";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Cấu hình CORS
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình session với Redis
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 3600000,
        },
    })
);

// Phục vụ các tệp HTML và các tệp tĩnh
app.use(express.static(path.join(__dirname, "public")));

// Phục vụ hình ảnh
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
    "/images/categories",
    express.static(path.join(__dirname, "images/category"))
);
app.use(
    "/images/products",
    express.static(path.join(__dirname, "images/products"))
);
app.use(
    "/images/brands",
    express.static(path.join(__dirname, "/images/brands"))
);

// API routes
app.use("/api/v1", categoryRouter);
app.use("/api/v1", subCategoryRouter);
app.use("/api/v1", customerRouter);
app.use("/api/v1", brandRouter);
app.use("/api/v1", cartRouter);
app.use("/api/v1", employeeRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", orderRouter);
app.get("/api/v1/setAnonymousSession", (req, res) => {
    if (!req.session.anonymousUser) {
        // Tạo session ẩn danh mới nếu chưa có
        req.session.anonymousUser = {
            id: `anon-${Date.now()}`,
            name: "Guest",
        };
    }
    res.json(req.session.anonymousUser);
});

// Khởi động server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
