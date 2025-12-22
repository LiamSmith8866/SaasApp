import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom"; // 1. 引入跳转钩子
import { API_URL } from "../config"; // 引入配置

export default function OCR() {
  const { user } = useUser();
  const { fetchUsage } = useUser();
  const navigate = useNavigate(); // 初始化跳转

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // 存放 AI 分析出的结果数据
  const [resultData, setResultData] = useState(null);

  // ===========================
  // 🖱️ 核心功能 1: Ctrl + V 粘贴监听
  // ===========================
  useEffect(() => {
    const handlePaste = (e) => {
      if (loading) return;
      const items = e.clipboardData.items;
      for (let item of items) {
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();
          setFile(blob);
          setPreview(URL.createObjectURL(blob));
          setResultData(null);
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [loading]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResultData(null);
    }
  };

  // 上传分析
  const handleUpload = async () => {
    if (!file) return alert("Please select or paste a picture first");
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      // 直连后端 5001
      const res = await fetch(`${API_URL}/api/ocr/scan`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setResultData(data.data);
        fetchUsage();
      } else {
        if (data.needUpgrade) {
          alert(data.message);
        } else {
          alert(data.message || "Identification failure");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please check if the backend service is started");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // 💾 核心功能 2: 批量保存到任务列表 (新增)
  // ===========================
  const handleBatchAdd = async () => {
    if (!resultData || !resultData.tasks) return;
    
    // 乐观 UI：先提示用户
    const confirm = window.confirm(`Are you sure you want to add ${resultData.tasks.length} tasks to your list?`);
    if (!confirm) return;

    try {
      // 并发请求：把所有任务发送给后端
      // 假设后端创建任务接口是 POST /api/tasks
      const promises = resultData.tasks.map(task => 
        fetch(`${API_URL}/api/tasks`, { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: task.title,
            priority: task.priority || "Medium", // 默认中优先级
            status: "To Do",
            dueDate: task.date || null
          }),
          credentials: "include"
        })
      );

      await Promise.all(promises);
      
      alert("✅ All tasks have been successfully saved！");
      navigate("/tasks"); // 跳转到任务看板查看，形成闭环
      
    } catch (error) {
      console.error(error);
      alert("Save failed. Please check if there is a /api/tasks interface in the back end");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">AI intelligent workflow assistant</h1>
      <p className="text-gray-500 mb-8">
      Upload the meeting whiteboard, handwritten notes or screenshots, and the AI will automatically extract your to-do items for you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 左侧：上传区 */}
        <div className="flex flex-col gap-4">
          <div 
            className={`border-2 border-dashed rounded-xl h-96 flex flex-col items-center justify-center bg-gray-50 transition relative overflow-hidden
              ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 hover:border-blue-400"}
            `}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-contain p-4" />
            ) : (
              <div className="text-center p-6 pointer-events-none">
                <span className="text-5xl block mb-4">📋</span>
                <p className="font-bold text-gray-700 text-lg">Ctrl + V Paste directly</p>
                <p className="text-sm text-gray-500 mt-2">Or click the button below to select the file</p>
              </div>
            )}
          </div>

            {/* 1. 真正的 input 隐藏起来 */}
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden" 
            />

            {/* 2. 用 Label 伪装成一个漂亮的白色按钮 */}
            <label
              htmlFor="file-upload"
              className="block w-full py-3 px-4 text-center border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition"
            >
              {file ? "Change File" : "Choose Image File"}
            </label>

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`w-full py-3.5 rounded-lg font-bold text-white transition shadow-md text-lg
              ${loading || !file ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.01] active:scale-[0.99]"}
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                AI is conducting in-depth analysis...
              </span>
            ) : "🚀 Start Analysis"}
          </button>
        </div>

        {/* 右侧：结果展示区 (UI 美化版) */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 flex flex-col h-[500px]">
          <div className="p-4 border-b bg-gray-50 rounded-t-xl">
             <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
              📊 Analysis results
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {loading && (
              <div className="flex flex-col items-center justify-center h-full space-y-6 animate-pulse">
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                <p className="text-sm text-blue-500 mt-4 font-medium">Identifying intentions and organizing task data...</p>
              </div>
            )}

            {!loading && !resultData && (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <span className="text-4xl mb-4">👈</span>
                <p>Please upload the picture on the left</p>
                <p className="text-sm">The result will be displayed here</p>
              </div>
            )}

            {!loading && resultData && (
              <div className="space-y-4">
                {/* 总结卡片 */}
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-blue-900 text-sm leading-relaxed">
                  <span className="font-bold mr-1">🤖 AI Summary:</span> 
                  {resultData.summary}
                </div>

                {/* 任务列表 */}
                <div className="space-y-3">
                  {resultData.tasks.map((task, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg hover:shadow-md transition bg-white group">
                      {/* 装饰性的 Checkbox */}
                      <div className="flex-shrink-0 h-5 w-5 rounded-full border-2 border-gray-300 group-hover:border-blue-500 flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate" title={task.title}>{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {/* 优先级标签 */}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide
                            ${task.priority === 'High' ? 'bg-red-100 text-red-600' : 
                              task.priority === 'Low' ? 'bg-green-100 text-green-600' : 
                              'bg-orange-100 text-orange-600'}
                          `}>
                            {task.priority || 'NORMAL'}
                          </span>
                          
                          {/* 日期标签 */}
                          {task.date && (
                            <span className="text-xs text-gray-400 flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded">
                              📅 {task.date}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 底部动作栏 */}
          {!loading && resultData && (
            <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <button 
                onClick={() => setResultData(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleBatchAdd}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition flex items-center gap-2"
              >
                <span>💾</span> Save all to my task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}