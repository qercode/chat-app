export interface IMessage {
    senderId: string;
    receiverId: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    shouldShake?: boolean
}