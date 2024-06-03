import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

interface DecodedToken {
    userId: string;
}

const protectedRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: "Пользователь не авторизован" });
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN || "") as DecodedToken;
        
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ error: "Пользователь не авторизован" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        (req as any).user = user;  // Temporarily using `any` type to avoid TypeScript issues

        next();
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default protectedRoute;
