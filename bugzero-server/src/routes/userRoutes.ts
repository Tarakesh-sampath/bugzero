import { Router, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../middleware/auth.js";
import { AuthenticatedRequest } from "../types/index.js";

const router = Router();

router.post("/register", authMiddleware, async (req, res: Response) => {
  const { username } = req as AuthenticatedRequest;

  try {
    const user = await prisma.user.upsert({
      where: { username },
      update: {},
      create: { username },
    });
    res.json({ message: "User processed", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to process user" });
  }
});

export default router;
