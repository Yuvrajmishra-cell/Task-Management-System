const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Not authorized, token missing"
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Not authorized, invalid token"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Not authorized, token missing"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Not authorized, invalid token"
        });
    }
};

module.exports = {
    protect
};
