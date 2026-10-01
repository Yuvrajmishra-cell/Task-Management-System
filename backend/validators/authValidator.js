const { body } = require("express-validator");

const SECURITY_QUESTIONS = [
    "What is your school name?",
    "What is your favorite book?",
    "What is your favorite teacher's name?",
    "What is your childhood nickname?"
];

const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
    body("securityQuestion")
        .trim()
        .notEmpty()
        .withMessage("Security question is required")
        .isIn(SECURITY_QUESTIONS)
        .withMessage("Please select a valid security question"),
    body("securityAnswer")
        .trim()
        .notEmpty()
        .withMessage("Security answer is required")
];

const loginValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
];

const forgotPasswordValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email")
];

const verifySecurityAnswerValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email"),
    body("answer")
        .trim()
        .notEmpty()
        .withMessage("Security answer is required")
];

const resetPasswordValidation = [
    body("resetToken")
        .trim()
        .notEmpty()
        .withMessage("Reset token is required"),
    body("newPassword")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters")
];

module.exports = {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    verifySecurityAnswerValidation,
    resetPasswordValidation
};
