const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Manager = require("../models/Manager");

dotenv.config();

const createManager = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingManager = await Manager.findOne({
            email: "testmanager@example.com"
        });

        if (existingManager) {
            console.log("Manager already exists");
            await mongoose.connection.close();
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("ManagerPassword123", 10);

        await Manager.create({
            name: "Test Manager",
            email: "testmanager@example.com",
            password: hashedPassword,
            role: "manager"
        });

        console.log("Manager created successfully");
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error(error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
};

createManager();
