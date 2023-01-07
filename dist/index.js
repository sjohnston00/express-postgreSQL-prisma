import express from "express";
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import rolesRouter from "./routes/roles.js";
import dotenv from "dotenv";
import { ZodError } from "zod";
dotenv.config();
const app = express();
app.use(express.json());
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/roles", rolesRouter);
app.use((req, res, next) => {
    res.status(404).json({
        message: "Not Found"
    });
});
app.use((error, req, res, next) => {
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
