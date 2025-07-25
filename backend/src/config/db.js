import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MOngoDB COnnected Successfully..${conn.connection.host}`);
    } catch (error) {
        console.log("Mongodb Error", error)
    }
}