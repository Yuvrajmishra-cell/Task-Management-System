const { body, query } = require("express-validator");

const createTaskValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required"),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),
    body("assignedTo")
        .notEmpty()
        .withMessage("assignedTo is required")
        .isMongoId()
        .withMessage("assignedTo must be a valid MongoDB ObjectId"),
    body("dueDate")
        .notEmpty()
        .withMessage("dueDate is required")
        .isISO8601()
        .withMessage("dueDate must be a valid ISO 8601 date")
];

const statusValidation = [
    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["Pending", "In Progress", "Completed"])
        .withMessage("Status must be Pending, In Progress, or Completed")
];

const getTasksValidation = [
    query("status")
        .optional()
        .isIn(["Pending", "In Progress", "Completed"])
        .withMessage("Status must be Pending, In Progress, or Completed"),
    query("dueBefore")
        .optional()
        .isISO8601()
        .withMessage("dueBefore must be a valid ISO 8601 date")
];

module.exports = {
    createTaskValidation,
    statusValidation,
    getTasksValidation
};
