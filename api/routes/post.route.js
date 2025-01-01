import express from "express";
import { create, getposts } from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js"; 
import { uploadSingle } from "../middlewares/upload.js";

const router = express.Router();

router.post("/posts", verifyToken, uploadSingle, create);
route.post("getposts", getposts)

export default router;
