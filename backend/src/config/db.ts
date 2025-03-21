import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`successfully connected to DB`);
  } catch (error) {
    console.log(`error while connecting to mongodb server`);
    process.exit(1);
  }
};
export default connectDB;
