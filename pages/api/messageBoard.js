import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export default async function handler(req, res) {
    const { username, message } =  JSON.parse(req.body);

    let user = await db.user.findFirst({
        where: {
            username: {
                equals: username
            }
        }
    });

    if(!user)
        user = await db.user.create({
            data: {
                username: username
            }
        });

    const result = await db.message.create({
        data: {
            message,
            user_id: user.id,
            created_on: new Date()
        }
    });

    res.status(200).json({
        message: `Your message was created, ${username}!`,
        result
    });
}