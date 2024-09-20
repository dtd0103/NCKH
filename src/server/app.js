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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 3600000 },
    })
);

app.post("/api/v1/validate-session", (req, res) => {
    const { sessionId } = req.body;

    redisClient.exists(`viewedProducts:${sessionId}`, (err, reply) => {
        if (err) {
            return res
                .status(500)
                .json({ message: "Có lỗi xảy ra.", error: err.message });
        }

        if (reply === 1) {
            return res.json({ valid: true });
        } else {
            return res.json({ valid: false });
        }
    });
});

app.get("/api/v1/session-id", (req, res) => {
    const sessionId = req.sessionID;
    res.json({ sessionId });
});

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
