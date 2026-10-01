const express = require("express");
const { validationResult } = require("express-validator");
const { createTask, getTasks, deleteTask } = require("../controllers/taskController");
const { updateTaskStatus } = require("../controllers/taskStatusController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { checkTaskOwnership } = require("../middleware/ownershipMiddleware");
const { createTaskValidation, statusValidation, getTasksValidation } = require("../validators/taskValidator");

const router = express.Router();

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array()
        });
    }
    next();
};

router.post(
    "/",
    protect,
    authorizeRoles("manager"),
    createTaskValidation,
    handleValidation,
    createTask
);

router.get("/", protect, getTasksValidation, handleValidation, getTasks);

router.patch(
    "/:id/status",
    protect,
    authorizeRoles("employee"),
    checkTaskOwnership,
    statusValidation,
    handleValidation,
    updateTaskStatus
);

router.delete("/:id", protect, deleteTask);

module.exports = router;
