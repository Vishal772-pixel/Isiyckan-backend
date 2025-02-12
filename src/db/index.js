import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from 'dotenv';  // Use import for ESM
dotenv.config();


const connectDB = async () => {
  try {
    const connectionString = process.env.MONGODB_URI; // Access your variables here
   
    console.log(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(process.env.MONGODB_URI); // Make sure it's correct

    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\nMongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB  connection error:", error);
    process.exit(1);
    console.log(process.env.MONGODB_URI); // Make sure it's correct

  }
};

export default connectDB;