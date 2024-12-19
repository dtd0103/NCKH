import jwt from "jsonwebtoken";

const authenticateAdminJWT = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = decoded;

            if (req.user.role !== "admin") {
                return res.sendStatus(403);
            }

            next();
        });
    } else {
        res.sendStatus(401);
    }
};

export default authenticateAdminJWT;
