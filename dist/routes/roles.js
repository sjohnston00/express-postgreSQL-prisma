import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();
import "express-async-errors";
router.get("/", async (req, res) => {
    const roles = await prisma.role.findMany({
        orderBy: {
            id: "asc",
        },
    });
    res.json(roles);
});
router.get("/:id", async (req, res) => {
    const roleId = Number(req.params.id);
    if (!roleId) {
        return res.status(400).json({
            message: "ID must be a number",
        });
    }
    const role = await prisma.role.findFirst({
        where: {
            id: roleId,
        },
    });
    if (!role) {
        return res.status(404).json({
            message: `Role with ID "${roleId}" not found`,
        });
    }
    res.json(role);
});
router.post("/", async (req, res) => {
    const { name } = req.body;
    if (!name || typeof name !== "string") {
        return res.status(400).json({
            message: '"name" is required to create a role',
        });
    }
    const { id } = await prisma.role.create({
        data: {
            name: name,
        },
        select: {
            id: true,
        },
    });
    res.status(201).json({
        data: {
            id,
        },
    });
});
export default router;
