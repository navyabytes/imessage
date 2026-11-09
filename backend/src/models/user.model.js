import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: false
    },
}{timestamps: true});
//is member since the user is a member of the app, and the timestamps option is set to true, which means that the schema will automatically add createdAt and updatedAt fields to the user documents.
//createdAt and updatedAt fields will be automatically added to the schema, which will store the timestamps for when a user document is created and last updated.
const User = mongoose.model("User", userSchema);
export default User;