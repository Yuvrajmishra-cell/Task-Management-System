const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Employee"
        },
        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Manager"
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed"],
            default: "Pending"
        },
        dueDate: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

taskSchema.index({ status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ assignedTo: 1 });

module.exports = mongoose.model("Task", taskSchema);
