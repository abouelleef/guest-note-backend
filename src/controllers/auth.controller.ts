import { User } from "@prisma/client"
import asyncHandler from "express-async-handler"
import { StatusCodes } from "http-status-codes"
import { createUser, findUserByEmail, loginUser, updateUserProfile } from "../services/user.service"
import AppError from "../utils/appError"
import fs from "fs-extra"
import jwt from "jsonwebtoken"
import { ACCESS_TOKEN_EXPIRES_IN, ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } from "../config/config"


export const registerUserController = asyncHandler(async (req, res, next) => {
    let user = await createUser({ ...req.body })
    if (!user) {
        return next(new AppError("User cannot be created", StatusCodes.BAD_REQUEST))
    }
    console.log(req.file, "🎈🎈")

    if (req.file) {

        const ext = req.file.path.split(".").at(-1)

        const profile = `${user.id}.${ext}`

        await fs.move(req.file.path, `${process.cwd()}\\public\\images\\profile\\${profile}`);
        user = await updateUserProfile(user.id, profile)
    }

    res.status(StatusCodes.CREATED).json({
        message: "Success",
        data: { user }
    })

})

export const loginUserController = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body
    const tokens = await loginUser(email, password)
    if (!tokens) {
        return next(new AppError("Incorrect email or password", StatusCodes.UNAUTHORIZED))
    }

    res.cookie("jwt", tokens.REFRESH_TOKEN, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        // maxAge: day * hour * minute * seconds * miliseconds = (7 days) 
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(StatusCodes.CREATED).json({
        message: "Success",
        data: { token: tokens.ACCESS_TOKEN }
    })

})

export const logoutUserController = asyncHandler(async (req, res, next) => {

    const cookies = req.cookies

    if (!cookies?.jwt) {
        res.sendStatus(StatusCodes.NO_CONTENT)
    }

    res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })

    res.status(StatusCodes.OK).json({
        message: "Cookie cleared"
    })


})

export const refreshController = asyncHandler(async (req, res, next) => {

    const cookies = req.cookies

    if (!cookies?.jwt) {
        next(new AppError("Please login first", StatusCodes.UNAUTHORIZED))
    }

    const refreshToken = cookies.jwt


    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY,
        async (err: any, decoded: any) => {
            if (err) return next(new AppError(`${err.name}`, StatusCodes.FORBIDDEN))

            const user = await findUserByEmail(decoded.email)
            if (!user) { return next(new AppError("No user found", StatusCodes.UNAUTHORIZED)) }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                ACCESS_TOKEN_SECRET_KEY,
                { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
            )

            res.status(StatusCodes.OK).json({
                message: "Success",
                data: { token }
            })
        }
    )
})
