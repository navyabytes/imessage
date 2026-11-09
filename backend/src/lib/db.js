import mongoose from "mongoose";

export async function connectDB() {
    try {
        const mongoURI = process.env.MONGO_URI;
        if(!mongoURI) {
            throw new Error("MONGO_URI is not defined in the environment variables.");
        }
        const conn = await mongoose.connect(mongoURI)
        console.log("MongoDB connected successfully", conn.connection.host);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
        //1 means that the process will exit with a failure code, indicating that the application failed to start due to the database connection error.
    }
};