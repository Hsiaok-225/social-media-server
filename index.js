import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authController from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";

import verifyJWT from "./middleware/verifyJWT.js";
import postsController from "./controllers/posts.js";

import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

const PORT = process.env.PORT || 5001;
/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
mongoose.set("strictQuery", true);
const app = express();

app.use(express.json());

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), authController.register);
app.post(
  "/posts",
  verifyJWT,
  upload.single("picture"),
  postsController.createPost
);

/* ROUTES */
app.use("/auth", authRoutes);
// SET app.use jwt here
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* FOR TEST ROUTES */
app.get("/", (req, res) => {
  res.send("hello world");
});

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server is Running on PORT:${PORT}`));
  })
  .catch((err) => console.log(`${err}, Connect failed`));
