import express from "express";
import { updateProfilePicture } from "../controllers/user.controller.js";

const router = express.Router();

// Update Profile Picture
router.put("/profile-picture/:id", updateProfilePicture);

export default router;
