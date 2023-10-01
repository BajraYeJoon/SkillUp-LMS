import mongoose from "mongoose";
require("dotenv").config();

const dbURI: string = process.env.DB_URI || "";

//connect to the database
const connectDB = async () => {
  try {
    await mongoose.connect(dbURI).then((data: any) => {
      console.log(`MongoDB connected: ${data.connection.host}`);
    });
  } catch (error) {
    console.error(error);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
