import prisma from "../utils/prisma";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {
    ACCESS_TOKEN_EXPIRES_IN,
    ACCESS_TOKEN_SECRET_KEY,
    REFRESH_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_SECRET_KEY,
} from "../config/config"
import { Note, Type } from "@prisma/client";
import { NoteBody } from "../interfaces/Note";

// const signToken = (id: string, email: string) =>
//     jwt.sign({ id, email }, ACCESS_TOKEN_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });

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
            return user
        }

        return null

    } catch (error: any) {
        console.log(error.message)
        return null
    }
}

export async function updateUserProfile(userId: string, profile: string) {
    try {
        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                profile_pic: profile
            }
        })
        return user
    } catch (error) {
        console.log(error);
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
            const ACCESS_TOKEN = jwt.sign(
                { id: user.id, email: user.email },
                ACCESS_TOKEN_SECRET_KEY,
                { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
            )
            const REFRESH_TOKEN = jwt.sign(
                { id: user.id, email: user.email },
                REFRESH_TOKEN_SECRET_KEY,
                { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
            )

            return { ACCESS_TOKEN, REFRESH_TOKEN }
        }

        return null
    } catch (error: any) {
        console.log(error.message)
        return null
    }
}


export async function sendNote(noteBody: NoteBody) {
    try {
        const user = await findUserByEmail(noteBody.email)

        if (!user) return null

        const noteType = await prisma.noteType.create({
            data: { name: Type[noteBody.type.toUpperCase() as (keyof typeof Type)] },
            select: { id: true }
        })

        const note = await prisma.note.create({
            data: {
                title: noteBody.title,
                body: noteBody.body,
                userId: user.id,
                noteTypeId: noteType.id,
            },

            include: {

                user: {
                    select: {
                        subscription: true
                    }
                }
            }
        })

        return note
    } catch (error: any) {
        console.log(error.message)
        return null
    }
}


export async function updateSubscription(subscription: string, userId: string) {

    try {

        let user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) { return "No user found" }

        if (user.subscription !== "" && user.subscription !== subscription) {
            user = await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    subscription
                }
            })

            return "Subscribed"

        }

        return "user already subscribed"


    } catch (error) {
        console.log(error);
        return null
    }

}