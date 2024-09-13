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
