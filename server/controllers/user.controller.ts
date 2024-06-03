import { Request, Response } from "express"
import User from "../models/user.model"

export  const getUsersForSidebar = async(req: Request, res: Response) => {
    try {
        
        const loggedInUserId = (req as any).user._id

        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}})

        res.status(200).json(filteredUsers)


    } catch (error) {
        console.log("Error in getUsersForSidebar", error)
    }
}