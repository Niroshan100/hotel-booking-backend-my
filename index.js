import bodyParser from 'body-parser';
import express from 'express';
import userRouter from './routes/usersRoute.js';
import mongoose from 'mongoose';  // Changed from { Mongoose }
import galleryItemRouter from "./routes/galleryItemRoute.js";
import iwt from 'jsonwebtoken';




const app = express();
app.use(bodyParser.json());

const connectionString = "mongodb+srv://niro_max:1234@cluster0.w25id.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use((req, res, next) => {
  const token = req.header("Autherization")?.replace("Bearer", "")
    
  if (token != null) {
    jwt.verify(token, "secret", (err, decoded) => {
      if (decoded != null) {
        req.user = decoded
        next()

      } else {
        next()
      }


    })
    

    
  } else {
    next()
  }


})




mongoose.connect(connectionString)  // Changed from Mongoose to mongoose
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {  // Added error handling
    console.error("MongoDB connection error:", error);
  });

app.use("/api/users", userRouter);
app.use("/api/gallery", galleryItemRouter);

app.listen(3000, () => {  // Removed unused req, res parameters
  console.log('Server is running on port 3000');
});