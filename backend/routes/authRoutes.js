const express = require("express");
const { validationResult } = require("express-validator");

const {
    registerUser,
    loginUser,
    createManager,
    getEmployees,
    forgotPassword,
    verifySecurityAnswer,
    resetPassword,
} = require("../controllers/authController");

const {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    verifySecurityAnswerValidation,
    resetPasswordValidation,
} = require("../validators/authValidator");

const {
    forgotPasswordLimiter,
    verifyAnswerLimiter,
    resetPasswordLimiter,
} = require("../middleware/rateLimitMiddleware");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array(),
        });
    }

    next();
};

// ─── Existing Routes (unchanged) ──────────────────────────────────────────────
router.post("/register", registerValidation, handleValidation, registerUser);

router.post("/login", loginValidation, handleValidation, loginUser);

router.post(
    "/create-manager",
    protect,
    authorizeRoles("manager"),
    createManager
);

router.get(
    "/employees",
    protect,
    authorizeRoles("manager"),
    getEmployees
);

// ─── Forgot Password Routes ──────────────────────────────────────────────────
router.post(
    "/forgot-password",
    forgotPasswordLimiter,
    forgotPasswordValidation,
    handleValidation,
    forgotPassword
);

router.post(
    "/verify-security-answer",
    verifyAnswerLimiter,
    verifySecurityAnswerValidation,
    handleValidation,
    verifySecurityAnswer
);

router.post(
    "/reset-password",
    resetPasswordLimiter,
    resetPasswordValidation,
    handleValidation,
    resetPassword
);

module.exports = router;
