import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function checkUserExistsByID(req, res, next) {
    const userId = Number(req.params.id);
    const userExists = await prisma.user.findFirst({
        where: {
            id: userId
        },
        select: {
            id: true
        }
    });
    if (!userExists) {
        return res.status(404).json({
            message: `User with ID "${userId}" not found`
        });
    }
    next();
}
