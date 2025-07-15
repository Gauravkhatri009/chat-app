import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/utils.js";
import cloudinary from "../config/cloudinary.js";

export const register = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password) return res.status(400).json({ message: "All fields are required." })

        if (password.length < 6) return res.status(500).json({ message: "password must be atleast 6 charecter" })

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already Exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword,

        });

        if (newUser) {
            //generate jwt token here
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                message: "User registered successfully",
                user: {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email
                }

            })
        } else {
            res.status(400).json({ message: "Invalid user data" })
        }
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not Found." });

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return res.status(400).json({ message: "Invalid credentials." });

        generateToken(user._id, res)

        res.status(200).json({
            message: "Login success..",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            }


        })

    } catch (err) {
        res.status(500).json({ message: err });
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully.." })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id

        if (!profilePic) return res.status(400).json({ message: "Profile pic. is required" });

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const upadatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

        res.status(200).json(upadatedUser)
        // res.status(200).json({
        //     message: "Profile updated successfully",
        //     profilePic: upadatedUser.profilePic,
        // });

    } catch (err) {
        console.log("error in update profile", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        console.log("Error in checkAuth controller.", err.message);
        res.status(500).json({ message: "Internal server error" })
    }
}