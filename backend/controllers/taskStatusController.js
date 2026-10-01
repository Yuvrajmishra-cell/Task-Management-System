const allowedStatuses = ["Pending", "In Progress", "Completed"];

const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        req.task.status = status;
        await req.task.save();

        return res.status(200).json({
            message: "Task status updated successfully",
            taskId: req.task._id,
            status: req.task.status
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    updateTaskStatus
};
