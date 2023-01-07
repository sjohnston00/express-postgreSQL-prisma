export * from "./users.js";
export * from "./roles.js";
export async function checkIdParamIsNumber(req, res, next) {
    const id = Number(req.params.id);
    if (!id || id < 0) {
        return res.status(400).json({
            message: "param must be a valid id number"
        });
    }
    next();
}
