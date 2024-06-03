import { Request, Response } from "express"
import User from "../models/user.model"
import bcrypt from 'bcrypt'
import { generateTokenAndSetCookie } from "../utils/generateToken"

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username })
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if (!user) {
            return res.status(400).json({error: "Имя пользователя введено неверно"})
        }

        if ( !isPasswordCorrect) {
            return res.status(400).json({error: "Пароль указан неверно"})

        }

        generateTokenAndSetCookie(user.id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username
        })

        

    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}



export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message: 'Выход выполнен успешно'})

    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}



export const signupUser = async (req: Request, res: Response) => {
    try {
        const { fullName, username, password, confirmPassword } = req.body
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Необходимо указать одинаковые пароли" })
        }


        const user = await User.findOne({ username })

        if (!!user) {
            return res.status(400).json({ error: "Такой пользователь уже существует" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword
        })

        if (!!newUser) {

            await generateTokenAndSetCookie(newUser.id, res)

            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.fullName,
            })
        } else {
            res.status(400).json({
                error: "Invalid data"
            })
        }



    } catch (err) {
        console.error('Error')
        res.status(500).json({ error: 'Internal Server Error' })

    }

}