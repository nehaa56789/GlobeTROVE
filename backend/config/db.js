const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // ❌ Don't log during tests
    if (process.env.NODE_ENV !== "test") {
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }

  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;