import prisma from "../utils/prisma";

export async function getNoteById(id: string) {
    try {
        const note = await prisma.note.findUnique({ where: { id } })
        return note
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function updateNoteMedia(id: string, media: string) {
    try {
        const note = await prisma.note.update({ where: { id }, data: { media } })
        return note
    } catch (error) {
        console.log(error)
        return null
    }
}


export async function getAllNotes(user: any, { limit, page }: { limit?: number, page?: number }) {
    try {
        const notes = await prisma.note.findMany({
            include: {
                noteType: {
                    select: {
                        name: true
                    }
                }
            },
            where: {
                userId: user.id,
                noteType: {
                    disabled: false
                }
            },
            skip: (page && limit) ? page * limit : undefined,
            take: limit
        })

        return notes
    } catch (error: any) {
        console.log(error.message)
        return null
    }

}