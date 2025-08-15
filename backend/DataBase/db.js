import mongoose from "mongoose";

async function connect() {
    try {
        console.log("Attempting to connect to MongoDB...");
        console.log("Connection string:", process.env.MONGO_URL);
        
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        
        console.log("✅ Successfully connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
}

export default connect;
