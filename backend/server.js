// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect database
// Connect to the MongoDB database using Mongoose

const connectToDatabase = async () => {
  await mongoose.connect("mongodb://0.0.0.0:27017/fullstack-tanstack");
  console.log("database connected");
};

connectToDatabase();
// define schemas
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: String,
  age: Number,
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/users", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, search } = req.query;

    // 1. Build filter object
    const queryObj = { ...req.query };
    const excludedFields = ["page", "limit", "sort", "search"];
    excludedFields.forEach((field) => delete queryObj[field]);

    // 2. Search
    if (search) {
      const regex = new RegExp(search, "i");
      const age = parseInt(search, 10);

      queryObj.$or = [
        { name: { $regex: regex } },
        { email: { $regex: regex } },
        ...(isNaN(age) ? [] : [{ age }]),
      ];
    }

    // 3. Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // 4. Base query
    let query = User.find(queryObj);

    // 5. Sorting
    if (sort) {
      const [field, order] = sort.split(":");
      query = query.sort({ [field]: order === "desc" ? -1 : 1 });
    }

    // 6. Total count
    const total = await User.countDocuments(queryObj);

    // 7. Pagination
    query = query.skip(skip).limit(limitNum);

    // 8. Execute
    const users = await query;

    res.status(200).json({
      count: users.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        next: skip + limitNum < total ? pageNum + 1 : null,
        prev: pageNum > 1 ? pageNum - 1 : null,
      },
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
