import React, { useState, useEffect } from "react";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    const newTask = {
      id: Date.now(),
      text: input,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setInput("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggle = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, text: editText } : t
      )
    );
    setEditingId(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tasks</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            placeholder="Enter a task..."
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300"
          />
          <button
            onClick={addTask}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
          >
            Add
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            {editingId === task.id ? (
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg mr-3"
              />
            ) : (
              <span
                onClick={() => toggle(task.id)}
                className={`flex-1 cursor-pointer ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {task.text}
              </span>
            )}

            {editingId === task.id ? (
              <button
                onClick={() => saveEdit(task.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => startEdit(task)}
                className="border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-100 mr-2"
              >
                Edit
              </button>
            )}

            <button
              onClick={() => deleteTask(task.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

