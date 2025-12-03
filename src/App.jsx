import React from "react";
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
            >
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
  );//是否需要把这个加入到上面  <Route path="timer" element={<Timer />} />
}
