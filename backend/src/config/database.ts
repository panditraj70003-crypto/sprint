import mongoose from "mongoose";
import { env } from "./env";

export async function connectDatabase() {
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 });
  console.info("MongoDB connected.");
}
