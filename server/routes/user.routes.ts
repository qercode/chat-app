import { Router } from "express";
import protectedRoute from "../middleware/protectRoute";
import { getUsersForSidebar } from "../controllers/user.controller";


const router = Router()


router.get("/", protectedRoute, getUsersForSidebar)

export default router