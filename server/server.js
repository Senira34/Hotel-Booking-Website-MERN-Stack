import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRotes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";

connectDB()
connectCloudinary();

const app = express()
app.use(cors())

//Middleware
app.use(express.json())
app.use(clerkMiddleware())

//Api to listen to clerk webhooks
app.use('/api/clerk' , clerkWebhooks);

app.get('/', (req, res) => res.send("API is working"))
app.use('/api/user', userRouter);
app.use('/api/hotel', hotelRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
