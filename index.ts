import express from "express"
import type { Request, Response, NextFunction } from "express"
// import pg from "pg"
import indexRouter from "./routes/index.js"
import usersRouter from "./routes/users.js"
import rolesRouter from "./routes/roles.js"
import dotenv from "dotenv"
dotenv.config()

const app = express()

app.use(express.json())
app.use("/", indexRouter)
app.use("/users", usersRouter)
app.use("/roles", rolesRouter)

//404 route
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(404).json({
      message: "Not Found",
    })
  }
)

//Error route
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  const message =
    error.message || "Something went wrong, please try again later"
  res.status(500)
  res.json({
    message: message,
  })
})

app.listen(3000, () => {
  console.log("App listening on port 3000")
})
