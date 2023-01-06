import express from "express"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
const router = express.Router()
import "express-async-errors" //handle error in async routes

//Get all roles
router.get("/", async (req, res) => {
  const roles = await prisma.role.findMany({
    orderBy: {
      id: "asc",
    },
  })
  res.json(roles)
})

//Get role By ID
router.get("/:id", async (req, res) => {
  const roleId = Number(req.params.id)

  if (!roleId) {
    return res.status(400).json({
      message: "ID must be a number",
    })
  }

  const role = await prisma.role.findFirst({
    where: {
      id: roleId,
    },
  })

  if (!role) {
    return res.status(404).json({
      message: `Role with ID "${roleId}" not found`,
    })
  }
  res.json(role)
})

//Create Role
router.post("/", async (req, res) => {
  const { name } = req.body

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      message: '"name" is required to create a role',
    })
  }

  const { id } = await prisma.role.create({
    data: {
      name: name,
    },
    select: {
      id: true,
    },
  })

  res.status(201).json({
    data: {
      id,
    },
  })
})

// //Update Role By ID
// router.put("/:id", async (req, res) => {
//   const roleId = req.params.id
//   const { name } = req.body

//   if (!name) {
//     return res.status(400).json({
//       message: '"name" is required to update role',
//     })
//   }

//   const { rowCount } = await client.query(
//     "UPDATE roles SET name=$1 WHERE id=$2",
//     [name, roleId]
//   )

//   if (rowCount === 0) {
//     return res.status(404).json({
//       message: `Role with ID "${roleId}" not found`,
//     })
//   }

//   res.end()
// })

// //Delete User By ID
// router.delete("/:id", async (req, res) => {
//   const roleId = req.params.id
//   const { rowCount } = await client.query("DELETE FROM roles WHERE id=$1", [
//     roleId,
//   ])

//   if (rowCount === 0) {
//     return res.status(404).json({
//       message: `Role with ID "${roleId}" not found`,
//     })
//   }

//   res.end()
// })

export default router
