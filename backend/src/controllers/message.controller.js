import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { hasImageKitConfig, uploadChatMedia } from "../lib/imagekit.js";
export async function getUsersForSidebar(req, res) {
    try{
        const loggedInUserId = req.user.id;
        const users = await User.find({_id: { $ne: loggedInUserId } }).select("-clerkId");
        res.status(200).json(users);
    }
    catch(error){
        console.error("Error fetching users for sidebar:", error.message);
        res.status(500).json({ error: "Failed to fetch users for sidebar" });
    }
}

export async function getConversationsForSidebar(req, res) {
    try{
        const loggedInUserId = req.user.id;
        // Implementation for fetching conversations for sidebar
        
        const conversations = await Message.aggregate([
            // 1. Find messages sent or received by logged-in user
            {
                $match: {
                    $or: [
                        { senderId: loggedInUserId },
                        { receiverId: loggedInUserId }
                    ]
                }
            },

            // 2. Sort messages by latest first
            {
                $sort: { createdAt: -1 }
            },

            // 3. Group messages by conversation partner
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$senderId", loggedInUserId] },
                            "$receiverId",
                            "$senderId"
                        ]
                    },
                    lastMessage: { $first: "$$ROOT" }
                }
            },

            // 4. Fetch conversation partner's profile
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },

            // 5. Convert user array into object
            {
                $unwind: "$user"
            },

            // 6. Hide Clerk ID
            {
                $project: {
                    "user.clerkId": 0
                }
            }
        ]);

        res.status(200).json(conversations);

    }
    catch(error){
        console.error("Error fetching conversations for sidebar:", error);
        res.status(500).json({ error: "Failed to fetch conversations for sidebar" });
    }
}

export async function getMessage(req, res) {
    try{
        const {id: userToChatId} = req.params;
        const myId = req.user.id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    }
    catch(error){
        console.error("Error fetching messages:", error.message);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
}

export async function sendMessage(req, res) {
    try{
        const {text} = req.body;
        const {id: recieverId} = req.params;
        const senderId = req.user.id;
        let imageUrl;
        let videoUrl;
        if(req.file){
            if(!hasImageKitConfig()){
                return res.status(500).json({ error: "ImageKit configuration is missing" });
            }
            const url = await uploadChatMedia(req.file);
            if(req.file.mimetype.startsWith("video/")){
                videoUrl = url;
            }
            else imageUrl = url;
            const newMessage = new Message({ senderId, receiverId: recieverId, text, image: imageUrl, video: videoUrl });
            await newMessage.save();
            // todo: realtime with socket.io
            // io.emit("newMessage", newMessage);
            res.status(201).json(await newMessage.save());
        }
    }
    catch(error){
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
}