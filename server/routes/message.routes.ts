import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller";
import protectedRoute from "../middleware/protectRoute";

const router = express.Router()

router.get('/:id',protectedRoute, getMessages)
router.post("/send/:id", protectedRoute, sendMessage)

export default router