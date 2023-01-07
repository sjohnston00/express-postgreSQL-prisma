import { PrismaClient } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export async function checkUserExistsByID(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
