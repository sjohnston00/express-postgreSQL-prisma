import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();
import "express-async-errors";
router.get("/", async (req, res) => {
    const users = await prisma.user.findMany({
        orderBy: {
            id: "desc",
        },
    });
    res.json(users);
});
router.get("/:id", async (req, res) => {
    const userId = Number(req.params.id);
    if (!userId || typeof userId !== "number") {
        return res.status(400).json({
            message: "ID must be a number",
        });
    }
    const user = await prisma.user.findFirst({
        where: {
            id: userId,
        },
        include: {
            role: true,
        },
    });
    if (!user) {
        return res.status(404).json({
            message: `User with ID "${userId}" not found`,
        });
    }
    res.json(user);
});
router.post("/", async (req, res) => {
    const { firstName, lastName, email, age } = req.body;
    if (!firstName || !lastName || !email || !age) {
        return res.status(400).json({
            message: '"firstName", "lastName", "email" and "age" are required to create a user',
        });
    }
    const { id } = await prisma.user.create({
        data: {
            firstname: firstName,
            lastname: lastName,
            email,
            age,
            role: {
                connectOrCreate: {
                    create: {
                        name: "User",
                        id: 1,
                    },
                    where: {
                        id: 1,
                    },
                },
            },
        },
        include: {
            role: true,
        },
    });
    res.status(201).json({
        data: {
            id,
        },
    });
});
export default router;
