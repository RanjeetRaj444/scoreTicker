import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { DB_NAME } from "../utils/constants.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const seedAdmin = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.set("strictQuery", true);
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("MongoDB connected!");

    const adminEmail = "admin@mykhel.com";
    const password = "adminpassword123"; // The user should change this immediately
    const username = "superadmin";

    const existedUser = await User.findOne({
      $or: [{ username }, { email: adminEmail }],
    });

    if (existedUser) {
      console.log("Admin user already exists. No action taken.");
      process.exit(0);
    }

    console.log("Creating super admin user...");
    await User.create({
      fullName: "Super Admin",
      email: adminEmail,
      password: password,
      username: username,
      role: "SUPER_ADMIN",
    });

    console.log("\n--- ADMIN CREDENTIALS ---");
    console.log(`Email: ${adminEmail}`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log("-------------------------\n");
    console.log("PLEASE CHANGE YOUR PASSWORD AFTER LOGGING IN!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
