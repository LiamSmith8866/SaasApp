import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  status: { type: String, default: "To Do" },
  priority: { type: String, default: "Medium" },
  dueDate: String,
}, { timestamps: true });
export default mongoose.model("Task", taskSchema);