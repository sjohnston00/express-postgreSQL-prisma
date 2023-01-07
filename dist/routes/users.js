import express from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const prisma = new PrismaClient();
const router = express.Router();
import "express-async-errors";
import { checkIdParamIsNumber, checkUserExistsByID } from "../middlewares/index.js";
const userSchema = z.object({
    firstname: z
        .string({
        invalid_type_error: "firstname must be of type string",
        required_error: "firstname is required"
    })
        .min(2, "firstname must be between 2-255 characters")
        .max(255, "firstname must be between 2-255 characters"),
    lastname: z
        .string({
        invalid_type_error: "lastname must be of type string",
        required_error: "lastname is required"
    })
        .min(2, "lastname must be between 2-255 characters")
        .max(255, "lastname must be between 2-255 characters"),
    email: z
        .string({
        invalid_type_error: "email must be of type string",
        required_error: "email is required"
    })
        .email()
        .min(6, "email must be between 6-255 characters")
        .max(255, "email must be between 6-255 characters"),
    age: z
        .number({
        invalid_type_error: "age must be of type number",
        required_error: "age is required"
    })
        .min(3, "age must be between 3-200")
        .max(200, "age must be between 3-200")
});
router.get("/", async (req, res) => {
    const users = await prisma.user.findMany({
        orderBy: {
            id: "desc"
        }
    });
    res.json(users);
});
router.get("/:id", checkIdParamIsNumber, async (req, res) => {
    const userId = Number(req.params.id);
    const user = await prisma.user.findFirst({
        where: {
            id: userId
        },
        include: {
            role: true
        }
    });
    if (!user) {
        return res.status(404).json({
            message: `User with ID "${userId}" not found`
        });
    }
    res.json(user);
});
router.post("/", async (req, res) => {
    const newUser = userSchema.parse(req.body);
    const { id } = await prisma.user.create({
        data: newUser
    });
    res.status(201).json({
        data: {
            id
        }
    });
});
router.delete("/:id", checkIdParamIsNumber, checkUserExistsByID, async (req, res) => {
    const userId = Number(req.params.id);
    await prisma.user.delete({
        where: {
            id: userId
        }
    });
    res.end();
});
export default router;
