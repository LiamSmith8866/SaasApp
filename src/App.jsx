import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";

// 布局与页面
import Layout from "./layout/Layout";
import LandingPage from "./pages/LandingPage"; // 新增的官网首页
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import OCR from "./pages/OCR";
import Login from './pages/Login';
import Register from './pages/Register'; // 假设你有这个注册页
import Upgrade from "./pages/Upgrade";
import UpgradeSuccess from "./pages/UpgradeSuccess";
import UserDashboard from "./pages/UserDashboard";

// --- 路由守卫组件 ---

// 1. 受保护路由：只有登录才能看，且自动包裹 Layout
function PrivateRoute() {
  const { user, loading } = useUser();
  if (loading) return <div>Loading...</div>;
  
  // 没登录 -> 踢去登录页
  if (!user) return <Navigate to="/login" replace />;

  // 登录了 -> 显示 Layout (侧边栏) + 子页面
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

// 2. 公开路由：只给没登录的人看 (比如登录页)
// 如果已经登录了还想访问登录页，直接踢去控制台 /dashboard
function PublicOnlyRoute({ children }) {
  const { user, loading } = useUser();
  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          
          {/* === 第一部分：不需要侧边栏的页面 === */}
          
          {/* 1. 官网首页 (所有人可见) */}
          <Route path="/" element={<LandingPage />} />

          {/* 2. 登录/注册 (只给未登录用户) */}
          <Route 
            path="/login" 
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            } 
          />
          {/* 如果还没做 Register 页，可以先指向 Login 或者写个简单的占位 */}
          <Route 
            path="/register" 
            element={
              <PublicOnlyRoute>
                {/* <Register /> */}
                <Login /> {/* 暂时先跳到登录 */}
              </PublicOnlyRoute>
            } 
          />


          {/* === 第二部分：应用内部页面 (需要侧边栏 + 必须登录) === */}
          
          {/* 注意：这里的 path 不再是 /，而是 /dashboard 开头 */}
          <Route element={<PrivateRoute />}>
            
            {/* 以前的首页，现在变成了控制台 */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/ocr" element={<OCR />} />
            <Route path="/upgrade" element={<Upgrade />} />
            <Route path="/upgrade-success" element={<UpgradeSuccess />} />
            <Route path="/account" element={<UserDashboard />} />
            
          </Route>

          {/* 404 */}
          <Route path="*" element={<div className="p-10 text-center">The page does not exist (404)</div>} />

        </Routes>
      </UserProvider>
    </Router>
  );
}
/*import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import OCR from "./pages/OCR";
import { UserProvider } from "./context/UserContext";
import { useUser } from "./context/UserContext";
import Login from './pages/Login';
import Upgrade from "./pages/Upgrade";
import UpgradeSuccess from "./pages/UpgradeSuccess";
import UserDashboard from "./pages/UserDashboard";

export default function App() {
function PrivateRoute({children}){
const { user,loading } =useUser();
if (loading) return <div>Loading...</div>
if(!user) return <Login />
 return children;
   }
return (
<Router>
<UserProvider>
<Layout>
<Routes>
     <Route path="/login" element={<Login />} />

     <Route
           /*path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          } */
        /*>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="ocr" element={<OCR />} /> 
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/upgrade-success" element={<UpgradeSuccess />} />
          <Route path="/account" element={<UserDashboard />} />
        
        </Route>
     </Routes>
     </Layout>
   </UserProvider>
  </Router>
   )
}*/

