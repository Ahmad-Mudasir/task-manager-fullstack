import { prisma } from "../lib/prisma.js";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1).default("General"),
});

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  category: z.string().min(1).optional(),
  completed: z.boolean().optional(),
});

export async function listTasks(_req, res) {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  res.json(tasks);
}

export async function createTask(req, res) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });
  const task = await prisma.task.create({
    data: { ...parsed.data, userId: req.user.id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  try {
    req.app.get("io")?.emit("taskCreated", task);
  } catch {}
  res.status(201).json(task);
}

export async function updateTask(req, res) {
  const id = Number(req.params.id);
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });
  const existing = await prisma.task.findFirst({
    where: { id, userId: req.user.id },
  });
  if (!existing) return res.status(404).json({ error: "Not found" });
  const updated = await prisma.task.update({
    where: { id },
    data: parsed.data,
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  try {
    req.app.get("io")?.emit("taskUpdated", updated);
  } catch {}
  res.json(updated);
}

export async function deleteTask(req, res) {
  const id = Number(req.params.id);
  const existing = await prisma.task.findFirst({
    where: { id, userId: req.user.id },
  });
  if (!existing) return res.status(404).json({ error: "Not found" });
  await prisma.task.delete({ where: { id } });
  try {
    req.app.get("io")?.emit("taskDeleted", { id });
  } catch {}
  res.status(204).end();
}
