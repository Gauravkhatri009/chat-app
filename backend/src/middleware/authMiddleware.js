import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) return res.status(401).json({ message: "Unauthorized - No Token Provided" });


        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) return res.status(401).json({ message: "Unauthorized - Invalid Token" });


        const user = await User.findById(decoded.userId).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        //if user authenticated add user to the request 
        req.user = user;
        //then call next function in the routes
        next()
    } catch (err) {
        console.log("Error in protected Middleware", err.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}