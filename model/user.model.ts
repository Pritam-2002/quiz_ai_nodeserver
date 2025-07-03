import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        currentGrade: {
            type: String,
            required: false,
            trim: true,
        },

        country: {
            type: String,
            required: false,
            trim: true,
        },

        phoneNumber: {
            type: String,
            required: false,
            trim: true,
        },
        isAdmin: {
            type: Boolean,
            default: false

        }
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);