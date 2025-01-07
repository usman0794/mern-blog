import express from "express";
import {
  create,
  deletepost,
  getposts,
  updatepost,
} from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { uploadSingle } from "../middlewares/upload.js";

const router = express.Router();

router.post("/create", verifyToken, uploadSingle, create);
router.get("/getposts", getposts);
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost);
router.put('/updatepost/:postId/:userId', verifyToken, updatepost);
export default router;
