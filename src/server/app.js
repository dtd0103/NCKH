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

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());

app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 60000 },
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
    "/images/categories",
    express.static(path.join(__dirname, "images/category"))
);
app.use(
    "/images/products",
    express.static(path.join(__dirname, "images/products"))
);

app.use("/api/v1", categoryRouter);
app.use("/api/v1", subCategoryRouter);
app.use("/api/v1", customerRouter);
app.use("/api/v1", brandRouter);
app.use("/api/v1", employeeRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", orderRouter);

app.listen(process.env.PORT, () => {
    console.log("Listening");
});
