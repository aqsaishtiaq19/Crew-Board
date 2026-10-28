const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected!");
  } catch (error) {
    console.error("DATABASE CONNECTION ERROR:", error);
  }
};

module.exports = connectDB;
