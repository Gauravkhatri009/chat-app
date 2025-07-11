import mongoose, { Mongoose } from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true,
        },
        receiverId: {
            type: String,
            require: true, type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true,
        },
        text: {
            type: String,

        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);

export default Message;