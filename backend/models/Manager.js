const mongoose = require("mongoose");

const SECURITY_QUESTIONS = [
    "What is your school name?",
    "What is your favorite book?",
    "What is your favorite teacher's name?",
    "What is your childhood nickname?"
];

const managerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: ["manager"],
            default: "manager"
        },
        securityQuestion: {
            type: String,
            enum: SECURITY_QUESTIONS,
            default: null
        },
        securityAnswer: {
            type: String,
            select: false,
            default: null
        },
        resetPasswordToken: {
            type: String,
            select: false,
            default: null
        },
        resetPasswordExpire: {
            type: Date,
            select: false,
            default: null
        },
        resetAnswerAttempts: {
            type: Number,
            default: 0,
            select: false
        },
        resetAnswerLockedUntil: {
            type: Date,
            default: null,
            select: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Manager", managerSchema);
