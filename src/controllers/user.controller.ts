import asyncHandler from 'express-async-handler'
import { createUser, loginUser, sendNote, updateSubscription, updateUserProfile } from '../services/user.service'
import AppError from '../utils/appError'
import { StatusCodes } from 'http-status-codes';
import { CustomRequest } from '../middlewares/protect.middleware';
import fs from "fs-extra"
import { updateNoteMedia, getAllNotes, deletNote } from '../services/notes.service';
// import webpush from "../config/webPushConfig"
import { Note, User } from '@prisma/client';
import webpush from "web-push"
import { WEB_PUSH_EMAIL, WEB_PUSH_PRIVATE_KEY, WEB_PUSH_PUBLIC_KEY } from '../config/config'


webpush.setVapidDetails(
    `mailto:${WEB_PUSH_EMAIL}`,
    WEB_PUSH_PUBLIC_KEY,
    WEB_PUSH_PRIVATE_KEY
);

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
        let note: any = await sendNote({ title, body, email, type })
        if (!note) {
            failedEmails.push(email)
            continue
        }
        //next(new AppError("Note can not be created", StatusCodes.BAD_REQUEST))

        if (note.user.subscription) {
            const payload = {
                title: "You have a new note",
                message: note.title.slice(0, 100) + "..."
            }

            webpush.sendNotification(JSON.parse(note.user.subscription), JSON.stringify(payload))

        }
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

export const subscribeController = asyncHandler(async (req: CustomRequest, res, next) => {


    const subscription = JSON.stringify({ ...req.body })

    let message = await updateSubscription(subscription, req.user?.id!)


    if (message === null) {
        message = "Error subscribing"
    }


    res.status(StatusCodes.OK).json({
        message
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

