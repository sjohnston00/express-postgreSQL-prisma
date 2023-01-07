import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function checkRoleExistsByID(req, res, next) {
    const roleId = Number(req.params.id);
    const roleExists = await prisma.role.findFirst({
        where: {
            id: roleId
        },
        select: {
            id: true
        }
    });
    if (!roleExists) {
        return res.status(404).json({
            message: `Role with ID "${roleId}" not found`
        });
    }
    next();
}
