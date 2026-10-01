const rateLimit = require("express-rate-limit");

// Dedicated rate limiter for POST /api/auth/forgot-password
// Max 5 requests per 15 minutes per IP
const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        return res.status(429).json({
            message: "Too many password reset requests. Please try again later."
        });
    }
});

// Dedicated rate limiter for POST /api/auth/verify-security-answer
// IP-based endpoint abuse protection (max 20 per 15 min),
// working alongside account-level 5-failed-attempt lock protection
const verifyAnswerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        return res.status(429).json({
            message: "Too many attempts. Please try again later."
        });
    }
});

// Dedicated rate limiter for POST /api/auth/reset-password
// Max 10 requests per 15 minutes per IP
const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        return res.status(429).json({
            message: "Too many attempts. Please try again later."
        });
    }
});

module.exports = {
    forgotPasswordLimiter,
    verifyAnswerLimiter,
    resetPasswordLimiter
};
