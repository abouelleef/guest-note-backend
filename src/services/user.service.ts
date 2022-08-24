import prisma from "../utils/prisma";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {
    JWT_SECRET_KEY,
    JWT_EXPIRES_IN,
} from "../config/config"
import { Note, Type } from "@prisma/client";
import { NoteBody } from "../interfaces/Note";

const signToken = (id: string, email: string) =>
    jwt.sign({ id, email }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });

const hashPassword = (password: string) => {
    return bcrypt.hash(password, parseInt(process.env.SALT as string));
};


export async function createUser(userInput: any) {
    const { name, profile_pic, email, password } = userInput

    try {

        const user = await prisma.user.create({
            data: { name, profile_pic, email, hashedPassword: await hashPassword(password) },
            select: { id: true, name: true, email: true, profile_pic: true }
        })

        if (user) {
            const token = signToken(user.id, user.email)
            return { user, token }
        }

        return null

    } catch (error: any) {
        console.log(error.message)
        return null
    }
}

export async function findUserByEmail(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })
        return user
    } catch (error: any) {
        console.log(error.message)
        return null
    }
}

export async function loginUser(email: string, password: string) {
    try {
        const user = await findUserByEmail(email)

        if (user && await bcrypt.compare(password, user.hashedPassword)) {
            return signToken(user.id, user.email)
        }

        return null
    } catch (error: any) {
        console.log(error.message)
        return null
    }
}


export async function sendNote(noteBody: NoteBody) {
    try {


        const noteType = await prisma.noteType.create({
            data: { name: Type[noteBody.type.toUpperCase() as (keyof typeof Type)] },
            select: { id: true }
        })

        let userIds: string[] = []

        for await (const email of noteBody.emails) {
            const user = (await prisma.user.findUnique({ where: { email }, select: { id: true } }))
            if (user) {
                userIds.push(user.id)
            }
        }

        if (!(userIds.length > 0)) return null


        const notes = await prisma.note.createMany({
            // data: {
            //     title: noteBody.title,
            //     body: noteBody.body,
            //     userId: user.id,
            //     noteTypeId: noteType.id,
            //     user: {

            //     }
            // },
            data: userIds.map(userId => ({
                title: noteBody.title,
                body: noteBody.body,
                userId,
                noteTypeId: noteType.id,
            }))


        })

        return notes
    } catch (error: any) {
        console.log(error.message)
        return null
    }
}
