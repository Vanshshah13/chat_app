import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI as string , {
            dbName : 'chatappMicroserviceapp'
        });

        console.log(`✅ MongoDb Connected Successfully : ${connectionInstance.connection.host}`);
    } catch (error: any) {
        console.log(`❌ MongoDB Connection failed : ${error.message}`);

        process.exit(1);
    }
}

export default connectDb;