import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();
import "express-async-errors";
import { z } from "zod";
import { checkIdParamIsNumber, checkRoleExistsByID } from "../middlewares/index.js";
const MIN_LENGTH = 2;
const MAX_LENGTH = 50;
const LENGTH_ERROR_MSG = `name must be between ${MIN_LENGTH}-${MAX_LENGTH} characters`;
const roleSchema = z.object({
    name: z
        .string({
        invalid_type_error: "name must be of type string",
        required_error: "name is required"
    })
        .min(MIN_LENGTH, LENGTH_ERROR_MSG)
        .max(MAX_LENGTH, LENGTH_ERROR_MSG)
});
router.get("/", async (req, res) => {
    const roles = await prisma.role.findMany({
        include: {
            users: true
        },
        orderBy: {
            id: "asc"
        }
    });
    res.json(roles);
});
router.get("/:id", checkIdParamIsNumber, async (req, res) => {
    const roleId = Number(req.params.id);
    if (!roleId) {
        return res.status(400).json({
            message: "ID must be a number"
        });
    }
    const role = await prisma.role.findFirst({
        where: {
            id: roleId
        },
        include: {
            users: true
        }
    });
    if (!role) {
        return res.status(404).json({
            message: `Role with ID "${roleId}" not found`
        });
    }
    res.json(role);
});
router.post("/", async (req, res) => {
    const newRole = roleSchema.parse(req.body);
    const { id } = await prisma.role.create({
        data: Object.assign(Object.assign({}, newRole), { users: {} })
    });
    res.status(201).json({
        data: {
            id
        }
    });
});
router.delete("/:id", checkIdParamIsNumber, checkRoleExistsByID, async (req, res) => {
    const roleId = Number(req.params.id);
    await prisma.role.delete({
        where: {
            id: roleId
        }
    });
    res.end();
});
export default router;
