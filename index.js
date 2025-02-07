import bodyParser from 'body-parser';
import express from 'express';
import userRouter from './routes/usersRoute.js';
import mongoose from 'mongoose';
import galleryItemRouter from "./routes/galleryItemRoute.js";
import jwt from 'jsonwebtoken';  // ✅ Fixed import statement
import dotenv from 'dotenv';

dotenv.config();  // ✅ Added dotenv.config() to load environment variables from .env file

const app = express();
app.use(bodyParser.json());

const connectionString = process.env.MONGO_URL;

app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");  // ✅ Fixed "Autherization" typo & missing space
  
  if (token) {
    jwt.verify(token, process.env.JWT_KEY,
      (err, decoded) => {
      if (decoded) {
        req.user = decoded;
      }
      next();  // ✅ Always call next(), even if there's an error
    });
  } else {
    next();
  }
});

mongoose.connect(connectionString)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.use("/api/users", userRouter);
app.use("/api/gallery", galleryItemRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
