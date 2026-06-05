const SECRET_KEY = process.env.JWT_SECRET;
const Jwt = require("jsonwebtoken");

const isAuthorised = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "No token"
        });
    }
 
    const token = authHeader.split(" ")[1];

    try {
        req.user = Jwt.verify(token, SECRET_KEY);
        next();
    } catch {
        return res.status(401).json({
            message: "Token not valid"
        });
    }
};

const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        req.user = Jwt.verify(token, SECRET_KEY);
    } catch {
        req.user = null;
    }

    next();
};

module.exports = {isAuthorised, optionalAuth};
