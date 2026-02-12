import { Router, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../middleware/auth.js";
import { AuthenticatedRequest } from "../types/index.js";

const router = Router();

router.post("/submit", authMiddleware, async (req, res: Response) => {
  const { username } = req as AuthenticatedRequest;
  const { problemId, solution } = req.body as {
    problemId?: string;
    solution?: string;
  };

  if (!problemId || !solution) {
    return res
      .status(400)
      .json({ error: "problemId and solution are required" });
  }

  try {
    const user = await prisma.user.create({
      data: {
        username,
      },
    });

    const submission = await prisma.submission.create({
      data: {
        problemId,
        solution,
        userId: user.id,
      },
    });

    res.json({ message: "Submission successful", submission });
  } catch (error) {
    res.status(500).json({ error: "Failed to store submission" });
  }
});

router.get("/my-submissions", authMiddleware, async (req, res: Response) => {
  const { username } = req as AuthenticatedRequest;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { submissions: { orderBy: { createdAt: "desc" } } },
    });

    res.json(user?.submissions || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

export default router;
