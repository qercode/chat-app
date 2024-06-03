import { Request, Response } from "express";
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";
import { getReceiverSocketId, io } from "../socket";

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { message } = req.body
        const { id: receiverId } = req.params
        const senderId = (req as any).user._id

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],

            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        })

        if (newMessage) {
            conversation.messages.push(newMessage._id)
        }

        await conversation.save()
        await newMessage.save()


        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }

        res.status(201).json(newMessage)

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
}


export const getMessages = async (req: Request, res: Response) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = (req as any).user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.error(error)
        console.log("Error in getMessages controller");
        res.status(500).json({ error: "Internal server error" });
    }
}