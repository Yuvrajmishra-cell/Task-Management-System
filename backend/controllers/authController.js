const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const Employee = require("../models/Employee");
const Manager = require("../models/Manager");

const generateToken = require("../utils/generateToken");

// ─── Helper: find a user by email across Employee & Manager ───────────────────
const findUserByEmail = async (email) => {
    let user = await Employee.findOne({ email });
    if (user) return { user, Model: Employee };

    user = await Manager.findOne({ email });
    if (user) return { user, Model: Manager };

    return { user: null, Model: null };
};

// ─── Register ─────────────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
    try {
        const { name, email, password, securityQuestion, securityAnswer } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide name, email, and password",
            });
        }

        if (!securityQuestion || !securityAnswer) {
            return res.status(400).json({
                message: "Security question and answer are required",
            });
        }

        const existingEmployee = await Employee.findOne({ email });
        const existingManager = await Manager.findOne({ email });

        if (existingEmployee || existingManager) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedAnswer = await bcrypt.hash(
            securityAnswer.trim().toLowerCase(),
            10
        );

        const user = await Employee.create({
            name,
            email,
            password: hashedPassword,
            role: "employee",
            securityQuestion,
            securityAnswer: hashedAnswer,
        });

        const token = generateToken(user._id, user.role);

        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        return res.status(500).json({
            message: "Server error",
        });
    }
};

// ─── Login ────────────────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password",
            });
        }

        let user = await Employee.findOne({ email });

        if (!user) {
            user = await Manager.findOne({ email });
        }

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = generateToken(user._id, user.role);

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
        });
    }
};

// ─── Create Manager ───────────────────────────────────────────────────────────
const createManager = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required",
            });
        }

        const existingEmployee = await Employee.findOne({ email });
        const existingManager = await Manager.findOne({ email });

        if (existingEmployee || existingManager) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const manager = await Manager.create({
            name,
            email,
            password: hashedPassword,
            role: "manager",
        });

        return res.status(201).json({
            message: "Manager created successfully",
            manager: {
                id: manager._id,
                name: manager.name,
                email: manager.email,
                role: manager.role,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        return res.status(500).json({
            message: "Server error",
        });
    }
};

// ─── Get Employees ────────────────────────────────────────────────────────────
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().select("_id name email role");

        return res.status(200).json(employees);
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
        });
    }
};

// ─── Forgot Password (Step 1): return security question ───────────────────────
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const { user } = await findUserByEmail(email);

        // Generic safe response — do not reveal whether email exists
        if (!user) {
            return res.status(200).json({
                message: "If this email is registered, the security question will be shown",
            });
        }

        if (!user.securityQuestion) {
            return res.status(400).json({
                message: "Security question is not configured for this account",
            });
        }

        return res.status(200).json({
            message: "Security question retrieved",
            securityQuestion: user.securityQuestion,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
        });
    }
};

// ─── Verify Security Answer (Step 2): issue reset token ───────────────────────
const verifySecurityAnswer = async (req, res) => {
    try {
        const { email, answer } = req.body;

        // Select securityAnswer, reset tokens, and attempt tracking fields
        let user = await Employee.findOne({ email }).select(
            "+securityAnswer +resetPasswordToken +resetPasswordExpire +resetAnswerAttempts +resetAnswerLockedUntil"
        );
        let Model = Employee;

        if (!user) {
            user = await Manager.findOne({ email }).select(
                "+securityAnswer +resetPasswordToken +resetPasswordExpire +resetAnswerAttempts +resetAnswerLockedUntil"
            );
            Model = Manager;
        }

        if (!user) {
            return res.status(400).json({
                message: "Incorrect security answer",
            });
        }

        const now = new Date();

        // Check if the recovery flow is currently locked
        if (user.resetAnswerLockedUntil && user.resetAnswerLockedUntil > now) {
            return res.status(429).json({
                message: "Too many incorrect attempts. Please try again later.",
            });
        }

        // If a previous lock duration has elapsed, reset attempts counter
        let attempts = user.resetAnswerAttempts || 0;
        if (user.resetAnswerLockedUntil && user.resetAnswerLockedUntil <= now) {
            attempts = 0;
        }

        if (!user.securityAnswer) {
            return res.status(400).json({
                message: "Security question is not configured for this account",
            });
        }

        const normalizedAnswer = answer.trim().toLowerCase();
        const isAnswerCorrect = await bcrypt.compare(normalizedAnswer, user.securityAnswer);

        if (!isAnswerCorrect) {
            attempts += 1;
            const updateData = { resetAnswerAttempts: attempts };

            // On 5th failed attempt, lock the recovery flow for 15 minutes
            if (attempts >= 5) {
                updateData.resetAnswerLockedUntil = new Date(Date.now() + 15 * 60 * 1000);
            }

            await Model.findByIdAndUpdate(user._id, updateData);

            return res.status(400).json({
                message: "Incorrect security answer",
            });
        }

        // Answer is correct: generate raw reset token and store SHA256 hash
        const rawResetToken = crypto.randomBytes(32).toString("hex");
        const hashedResetToken = crypto
            .createHash("sha256")
            .update(rawResetToken)
            .digest("hex");

        const expireAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Clear attempts counter and lock on success
        await Model.findByIdAndUpdate(user._id, {
            resetPasswordToken: hashedResetToken,
            resetPasswordExpire: expireAt,
            resetAnswerAttempts: 0,
            resetAnswerLockedUntil: null,
        });

        return res.status(200).json({
            message: "Security answer verified",
            resetToken: rawResetToken,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
        });
    }
};

// ─── Reset Password (Step 3): set new password ────────────────────────────────
const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        // Hash the incoming raw token to compare against what is stored
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const now = new Date();

        // Search across both models
        let user = await Employee.findOne({
            resetPasswordToken: hashedToken,
        }).select("+resetPasswordToken +resetPasswordExpire");
        let Model = Employee;

        if (!user) {
            user = await Manager.findOne({
                resetPasswordToken: hashedToken,
            }).select("+resetPasswordToken +resetPasswordExpire");
            Model = Manager;
        }

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token",
            });
        }

        if (!user.resetPasswordExpire || user.resetPasswordExpire < now) {
            // Clear expired token
            await Model.findByIdAndUpdate(user._id, {
                resetPasswordToken: null,
                resetPasswordExpire: null,
            });
            return res.status(400).json({
                message: "Reset token has expired. Please restart the forgot-password process.",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Save new password, invalidate the reset token immediately, and clear attempts/lock
        await Model.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpire: null,
            resetAnswerAttempts: 0,
            resetAnswerLockedUntil: null,
        });

        return res.status(200).json({
            message: "Password reset successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    createManager,
    getEmployees,
    forgotPassword,
    verifySecurityAnswer,
    resetPassword,
};