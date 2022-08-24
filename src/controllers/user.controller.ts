import asyncHandler from 'express-async-handler'
import { createUser, loginUser, sendNote } from '../services/user.service'
import AppError from '../utils/appError'
import { StatusCodes } from 'http-status-codes';
import { CustomRequest } from '../middlewares/protect.middleware';
import fs from "fs-extra"
import { updateNoteMedia, getAllNotes } from '../services/notes.service';

export const registerUser = asyncHandler(async (req, res, next) => {
    const user = await createUser({ ...req.body })
    if (!user) {
        return next(new AppError("User cannot be created", StatusCodes.BAD_REQUEST))
    }
    console.log(req.file, "🎈🎈")
    console.log(process.cwd())

    if (req.file) {

        const ext = req.file.path.split(".").at(-1)

        await fs.move(req.file.path, `${process.cwd()}\\public\\images\\profile\\${user.user.id}.${ext}`)
    }

    res.status(StatusCodes.CREATED).json({
        message: "Success",
        data: { ...user }
    })

})

export const loginUserController = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body
    const token = await loginUser(email, password)
    if (!token) {

        return next(new AppError("Incorrect email or password", StatusCodes.UNAUTHORIZED))
    }

    res.status(StatusCodes.CREATED).json({
        message: "Success",
        data: { token }
    })

})

export const sendNoteController = asyncHandler(async (req, res, next) => {

    const { title, body, emailsData, type } = req.body

    let emails: string[] = (typeof emailsData !== "object") ? [emailsData] : emailsData



    let notes = await sendNote({ title, body, emails, type })
    if (!notes) return next(new AppError("Note can not be created", StatusCodes.BAD_REQUEST))

    if (req.files && req.files.length > 0) {
        console.log(req.files);

        notes.

        let media: string[] = [];
        (req.files as Express.Multer.File[]).forEach((image, i) => {
            const ext = image.path.split(".").at(-1)
            const imageName = `${note!.id}_${i + 1}.${ext}`
            media.push(imageName)
            fs.moveSync(image.path, `${process.cwd()}\\public\\images\\notes\\${imageName}`)
        })

        note = await updateNoteMedia(note.id, media.join(","))

    }

    res.status(StatusCodes.CREATED).json({
        message: "Success",
        data: { note }
    })

})


export const getAllNotesConteroller = asyncHandler(async (req: CustomRequest, res, next) => {

    const { limit, page } = req.query

    let limitNum: number | undefined
    let pageNum: number | undefined

    if (limit && page) {
        limitNum = parseInt(limit as string);
        pageNum = parseInt(page as string) - 1
    }

    const notes = await getAllNotes(req.user, { limit: limitNum, page: pageNum })

    if (!notes) return next(new AppError("No notes found", StatusCodes.BAD_REQUEST))

    console.log(limit, page, "👓")
    res.status(StatusCodes.OK).json({
        message: "Success",
        data: { notes }
    })
})