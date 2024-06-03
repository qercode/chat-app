import express from "express";
import { loginUser, logoutUser, signupUser } from "../controllers/auth.controller";

const router = express.Router()

router.get("", (req, res) => {
    res.send('Hello')
})

router.post("/signup", signupUser)

router.post("/login", loginUser)

router.get("/logout", logoutUser)


export default router