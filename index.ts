import express from "express";
import type { Request, Response, NextFunction } from "express";
// import pg from "pg"
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import rolesRouter from "./routes/roles.js";
import dotenv from "dotenv";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/index.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/roles", rolesRouter);

//404 route
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(404).json({
      message: "Not Found"
    });
  }
);

//Error route
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  let message;
  let status = 500;
  message = error.message || "Something went wrong, please try again later";
  if (error instanceof ZodError) {
    message = error.issues.map((issues) => issues.message);
    status = 400;
  }
  res.status(status);
  res.json({
    message: message
  });
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
