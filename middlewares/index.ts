export * from "./users.js";
export * from "./roles.js";
import type { Request, Response, NextFunction } from "express";

export async function checkIdParamIsNumber(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);

  if (!id || id < 0) {
    return res.status(400).json({
      message: "param must be a valid id number"
    });
  }

  next();
}
