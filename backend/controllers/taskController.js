const mongoose = require("mongoose");
const Task = require("../models/Task");
const Employee = require("../models/Employee");

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;

    if (!title || !description || !assignedTo || !dueDate) {
      return res.status(400).json({
        message:
          "Please provide title, description, assignedTo and dueDate",
      });
    }

    const employee = await Employee.findById(assignedTo);

    if (!employee) {
      return res.status(404).json({
        message: "Assigned employee not found",
      });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      dueDate,
      assignedBy: req.user.id,
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const { status, dueBefore } = req.query;

    const filter = {};

    // Employees can only see tasks assigned to themselves
    if (req.user.role === "employee") {
      filter.assignedTo = req.user.id;
    }

    if (status) {
      filter.status = status;
    }

    if (dueBefore) {
      filter.dueDate = { $lte: new Date(dueBefore) };
    }

    const tasks = await Task.find(filter);

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Role: Manager - authorized to delete any task
    if (req.user.role === "manager") {
      await Task.findByIdAndDelete(id);
      return res.status(200).json({
        message: "Task deleted successfully",
      });
    }

    // Role: Employee - can only delete their own completed tasks
    if (req.user.role === "employee") {
      const isAssigned = task.assignedTo.toString() === req.user.id.toString();
      const isCompleted = task.status === "Completed";

      if (!isAssigned || !isCompleted) {
        return res.status(403).json({
          message: "Employees can only delete their own completed tasks",
        });
      }

      await Task.findByIdAndDelete(id);
      return res.status(200).json({
        message: "Task deleted successfully",
      });
    }

    return res.status(403).json({
      message: "Forbidden: insufficient permissions",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  deleteTask,
};
