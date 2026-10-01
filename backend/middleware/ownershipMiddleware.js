const Task = require("../models/Task");

const checkTaskOwnership = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        if (task.assignedTo.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                message: "Forbidden: You can only modify tasks assigned to you"
            });
        }

        req.task = task;
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    checkTaskOwnership
};
