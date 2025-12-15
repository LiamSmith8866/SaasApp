// backend/src/routes/taskRoutes.js
import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. 获取我的所有任务 (按创建时间倒序)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 2. 创建任务 (OCR 页面已经用到了)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, status, priority, dueDate } = req.body;
    const newTask = await Task.create({
      userId: req.user.id,
      title,
      status: status || "To Do",
      priority: priority || "Medium",
      dueDate
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Create Error" });
  }
});

// 3. 更新任务状态 (打钩完成/取消完成)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    // 更新字段
    task.status = req.body.status || task.status;
    await task.save();
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Update Error" });
  }
});

// 4. 删除任务
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const result = await Task.deleteOne({ _id: req.params.id, userId: req.user.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Task not found" });
    
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete Error" });
  }
});

export default router;