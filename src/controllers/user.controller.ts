import asyncHandler from 'express-async-handler'
import { createUser, loginUser, sendNote, updateUserProfile } from '../services/user.service'
import AppError from '../utils/appError'
import { StatusCodes } from 'http-status-codes';
import { CustomRequest } from '../middlewares/protect.middleware';
import fs from "fs-extra"
import { updateNoteMedia, getAllNotes, deletNote } from '../services/notes.service';
import webpush from "../config/webPushConfig"
import { User } from '@prisma/client';

export const registerUser = asyncHandler(async (req, res, next) => {
    let userWithToken = await createUser({ ...req.body })
    if (!userWithToken) {
        return next(new AppError("User cannot be created", StatusCodes.BAD_REQUEST))
    }
    console.log(req.file, "🎈🎈")
    console.log(process.cwd())

    if (req.file) {

        const ext = req.file.path.split(".").at(-1)

        const profile = `${userWithToken.user.id}.${ext}`

        await fs.move(req.file.path, `${process.cwd()}\\public\\images\\profile\\${profile}`);
        (userWithToken.user as User | null) = await updateUserProfile(userWithToken.user.id, profile)
    }

    res.status(StatusCodes.CREATED).json({
        message: "Success",
        data: { ...userWithToken }
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
    console.log(req.body, "🧨🧨")

    let emails: string[] = (typeof emailsData !== "object") ? emailsData.split(",") : emailsData


    // to remove duplicates
    emails = Array.from(new Set(emails))

    console.log(emails, "🧨🧨🧨")

    let notes: any[] = []
    let failedEmails: any[] = []

    for (const email of emails) {
        let note = await sendNote({ title, body, email, type })
        if (!note) {
            failedEmails.push(email)
            continue
        }
        //next(new AppError("Note can not be created", StatusCodes.BAD_REQUEST))

        console.log(req.files, "🎎🎎");
        if (req.files && req.files.length > 0) {
            console.log(req.files, "🎎🎎");


            let media: string[] = [];
            (req.files as Express.Multer.File[]).forEach((image, i) => {
                const ext = image.path.split(".").at(-1)
                const imageName = `${note!.id}_${i + 1}.${ext}`
                media.push(imageName)
                fs.copySync(image.path, `${process.cwd()}\\public\\images\\notes\\${imageName}`)
            })

            note = await updateNoteMedia(note.id, media.join(","))

            notes.push(note)
        }
    }


    await fs.emptyDir(`${process.cwd()}\\public\\images\\temp`)


    res.status(StatusCodes.CREATED).json({
        message: "Success",
        data: { notes, failedEmails }
    })

})


export const getAllNotesConteroller = asyncHandler(async (req: CustomRequest, res, next) => {

    const { limit, page, type } = req.query

    let limitNum: number | undefined
    let pageNum: number | undefined
    let typeSelected: string | undefined

    if (type) {
        typeSelected = (type as unknown as string)!.toUpperCase()
    }

    if (limit && page) {
        limitNum = parseInt(limit as string);
        pageNum = parseInt(page as string) - 1
    }

    const notes = await getAllNotes(req.user, { limit: limitNum, page: pageNum, type: typeSelected })

    if (!notes) return next(new AppError("No notes found", StatusCodes.BAD_REQUEST))

    console.log(limit, page, "👓")
    res.status(StatusCodes.OK).json({
        message: "Success",
        data: { notes }
    })
})

export const subscribeController = asyncHandler(async (req, res, next) => {
    const subscription = req.body

    const payload = JSON.stringify({ message: 'Your Push Payload Text' })

    webpush.sendNotification(subscription, payload);
    // if (!note) return next(new AppError(`Can not delete note ${noteId}`))

    res.status(StatusCodes.OK).json({
        message: "Success",
        // data: {  }
    })
})


export const deleteNoteController = asyncHandler(async (req, res, next) => {
    const noteId: string = req.params.id as unknown as string

    const note = await deletNote(noteId)

    if (!note) return next(new AppError(`Can not delete note ${noteId}`))

    res.status(StatusCodes.OK).json({
        message: "Success",
        data: { note }
    })
})

