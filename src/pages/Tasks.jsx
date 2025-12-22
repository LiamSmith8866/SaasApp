import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// 1. ✅ 引入 Plus 图标
import { CheckSquare, Trash2, Calendar, ScanText, AlertTriangle, Plus, X } from "lucide-react";
import { API_URL } from "../config"; // 引入配置

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
   
  // 删除弹窗状态
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // 2. ✅ 新增任务弹窗状态
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // 加载任务
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        credentials: "include",
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 切换状态
  const toggleStatus = async (task) => {
    const newStatus = task.status === "Done" ? "To Do" : "Done";
    setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: newStatus } : t));

    try {
      await fetch(`${API_URL}/api/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      });
    } catch (err) {
      console.error("Update failed", err);
      fetchTasks();
    }
  };

  // 删除逻辑
  const confirmDelete = (id) => {
    setTaskToDelete(id);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!taskToDelete) return;
    
    setTasks(prev => prev.filter(t => t._id !== taskToDelete));
    setShowDeleteModal(false);

    try {
      await fetch(`${API_URL}/api/tasks/${taskToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
      fetchTasks();
    }
  };

  // 3. ✅ 手动创建任务逻辑
  const handleManualCreate = async (e) => {
    if (e) e.preventDefault(); // 防止表单默认提交
    if (!newTaskTitle.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle,
          priority: "Medium", // 默认中优先级
          status: "To Do"
        }),
        credentials: "include"
      });

      if (res.ok) {
        setNewTaskTitle(""); // 清空输入框
        setShowCreateModal(false); // 关闭弹窗
        fetchTasks(); // 刷新列表显示新任务
      }
    } catch (err) {
      alert("Failed to create task");
    } finally {
      setIsCreating(false);
    }
  };

  // 过滤逻辑
  const filteredTasks = tasks.filter(t => {
    if (filter === "done") return t.status === "Done";
    if (filter === "todo") return t.status !== "Done";
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto relative min-h-screen">
      {/* 顶部标题栏 */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CheckSquare className="text-blue-600" /> Task Management
          </h1>
          <p className="text-gray-500 mt-1">Manage tasks extracted from OCR or created manually.</p>
        </div>

        <div className="flex gap-2 items-center">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="all">All tasks</option>
            <option value="todo">To Do</option>
            <option value="done">Done</option>
          </select>
          
          {/* ✅ 新增：手动添加按钮 */}
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition"
          >
            <Plus size={16} /> Add Task
          </button>

          <Link 
            to="/ocr" 
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition"
          >
            <ScanText size={16} /> New recognition
          </Link>
        </div>
      </div>

      {/* 列表区域 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-gray-400">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <ScanText size={48} className="text-gray-300" />
            </div>
            <p className="text-lg font-medium text-gray-600">There is no task yet.</p>
            <p className="text-sm mb-6">Upload a picture or create a task manually.</p>
            <div className="flex gap-4">
                <button onClick={() => setShowCreateModal(true)} className="text-blue-600 font-bold hover:underline">
                    + Add manually
                </button>
                <span className="text-gray-300">|</span>
                <Link to="/ocr" className="text-blue-600 font-bold hover:underline">
                    Try OCR &rarr;
                </Link>
            </div>
          </div>
        ) : filteredTasks.length === 0 ? (
           <div className="p-8 text-center text-gray-400">There are no tasks that meet the screening criteria</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredTasks.map((task) => (
              <li key={task._id} className="group flex items-center gap-4 p-4 hover:bg-gray-50 transition duration-150">
                <button
                  onClick={() => toggleStatus(task)}
                  className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition
                    ${task.status === "Done" 
                      ? "bg-green-500 border-green-500 text-white" 
                      : "border-gray-300 hover:border-blue-500 text-transparent"}
                  `}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </button>

                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleStatus(task)}>
                  <p className={`font-medium text-gray-800 truncate transition ${task.status === "Done" ? "line-through text-gray-400" : ""}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide
                      ${task.priority === 'High' ? 'bg-red-100 text-red-600' : 
                        task.priority === 'Low' ? 'bg-green-100 text-green-600' : 
                        'bg-orange-100 text-orange-600'}
                    `}>
                      {task.priority || 'Medium'}
                    </span>

                    {task.dueDate && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={12} /> {task.dueDate}
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => confirmDelete(task._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 删除确认弹窗 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete this task?</h3>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone. Are you sure?
              </p>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ✅ 新增：创建任务弹窗 */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 relative">
            {/* 关闭按钮 */}
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Task</h3>
            
            <form onSubmit={handleManualCreate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Content</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="e.g., Buy milk, Finish report..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTaskTitle.trim() || isCreating}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-md transition
                    ${!newTaskTitle.trim() || isCreating ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}
                  `}
                >
                  {isCreating ? "Adding..." : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}