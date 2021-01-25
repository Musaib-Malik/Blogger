// Import mongoose
const mongoose = require("mongoose");

// Connect with database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useFindAndModify: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(`MongoDB Connected.`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Export db
module.exports = connectDB;
