import express from "express";
const router = express.Router();
router.get("/", async (req, res) => {
    res.send("Express Prisma Test");
});
export default router;
