import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const connectDB = async () => {
    console.log(process.env.DATABASE_URL)
    await mongoose.connect(`mongodb://localhost:27017/fraudDetector`)
        .then(() => { console.log("database is connected") })
        .catch((error) => { console.log(`mongo error : ${error}`) })

}


export default connectDB;

