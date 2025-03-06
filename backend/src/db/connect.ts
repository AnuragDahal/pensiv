import mongoose from "mongoose";
import { env } from "@/config/env";
export const connect = async () => {
  try {
    const connection = await mongoose.connect(env.MONGO_URI);

    const host = connection.connection.host;
    console.log(`Connected to MongoDB at host: ${host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from DB");
});
