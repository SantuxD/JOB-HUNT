const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB connected Successfully✅");
  } catch (err) {
    console.log("MongoDB connection Error❌", err);
    process.exit(1);
  }
};

module.exports = connectDB;
