import express from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const prisma = new PrismaClient();
const router = express.Router();
import "express-async-errors"; //handle error in async routes

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

type User = z.infer<typeof userSchema>;

//Get all users
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: {
      id: "desc"
    }
  });
  res.json(users);
});

//Get User By ID
router.get("/:id", async (req, res) => {
  const userId = Number(req.params.id);

  if (!userId || typeof userId !== "number") {
    return res.status(400).json({
      message: "ID must be a number"
    });
  }

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

//Create User
router.post("/", async (req, res) => {
  const newUser: User = userSchema.parse(req.body);
  const { id } = await prisma.user.create({
    data: {
      ...newUser,
      role: {
        connectOrCreate: {
          create: {
            name: "User",
            id: 1
          },
          where: {
            id: 1
          }
        }
      }
    },
    include: {
      role: true
    }
  });

  res.status(201).json({
    data: {
      id
    }
  });
});

// //Update User By ID
// router.put("/:id", async (req, res) => {
//   const userId = req.params.id
//   const { firstName, lastName } = req.body

//   if (!firstName || !lastName) {
//     return res.status(400).json({
//       message: '"firstName" and "lastName" are required to update user',
//     })
//   }

//   const { rowCount } = await client.query(
//     "UPDATE users SET firstName=$1, lastName=$2 WHERE id=$3",
//     [firstName, lastName, userId]
//   )

//   if (rowCount === 0) {
//     return res.status(404).json({
//       message: `User with ID "${userId}" not found`,
//     })
//   }

//   res.end()
// })

// //Delete User By ID
// router.delete("/:id", async (req, res) => {
//   const userId = req.params.id
//   const { rowCount } = await client.query("DELETE FROM users WHERE id=$1", [
//     userId,
//   ])

//   if (rowCount === 0) {
//     return res.status(404).json({
//       message: `User with ID "${userId}" not found`,
//     })
//   }

//   res.end()
// })

export default router;
