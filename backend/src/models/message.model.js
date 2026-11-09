import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    video: {
        type: String,
        required: false,
    },{timestamps: true});  
const Message = mongoose.model("Message", messageSchema);
export default Message;
