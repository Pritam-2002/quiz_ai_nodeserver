import { User } from "../model/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error(
        "JWT secret is missing. Set the JWT_SECRET environment variable."
    );
}

export const userSignup = async (req: any, res: any) => {
    try {
        const { name, email, password, phoneNumber, currentGrade, country, isAdmin } = req.body;
        console.log(req.body);
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exist" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const NewUSer = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            currentGrade,
            country,
            isAdmin: isAdmin ?? false
        });

        const saveUser = await NewUSer.save();
        if (!JWT_SECRET) {
            return res.status(500).json({ error: "JWT secret is missing" });
        }

        const token = jwt.sign(
            { userId: NewUSer._id, email: NewUSer.email, isAdmin: NewUSer.isAdmin },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res
            .status(201)
            .json({ message: "New user Created", user: saveUser, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const userSignin = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, email: user.email, isAdmin: user.isAdmin },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({ message: "Logged In Successful", user, token });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
