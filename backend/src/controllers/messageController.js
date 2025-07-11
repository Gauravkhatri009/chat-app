import User from "../models/userModel.js";
import Message from "../models/messageModel.js"
import cloudinary from "../config/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUser = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUser);

    } catch (err) {
        console.error("Error in getUserForSIdebar", err.message);
        res.status(500).json({ message: "Internal server error " });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ],
        });

        res.status(200).json(messages);

    } catch (err) {
        console.error("Error in getMessages Controller", err.message);
        res.status(500).json({ message: "Internal server error " });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            //Upload Base64 iamge to Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        //todo: realtime functionality goes here => socket.io

        res.status(201).json(newMessage);
    } catch (err) {
        console.error("Error in sendMessage Controller", err.message);
        res.status(500).json({ message: "Internal server error " });
    }
}