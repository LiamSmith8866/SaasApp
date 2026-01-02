import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { CheckCircle, Zap, Image, ListTodo, ArrowRight } from "lucide-react";

const LandingPage = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* 📣 1. Beta 测试通告栏 (吸睛) */}
      <div className="bg-indigo-600 text-white text-center py-2 px-4 text-sm font-medium">
        🚀 <span className="font-bold">Public Beta is Live!</span> Use code <span className="bg-white text-indigo-600 px-1 rounded mx-1 font-bold">TEST</span> at checkout to get PRO features for FREE (Limited Time).
      </div>

      {/* 导航栏 */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="text-2xl font-extrabold text-blue-600 flex items-center gap-2">
          <Zap size={28} /> Technology OCR
        </div>
        <div className="space-x-4">
          {user ? (
            <Link to="/dashboard" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium">
                Log in
              </Link>
              <Link to="/register" className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero 区域 (首屏) */}
      <div className="max-w-4xl mx-auto text-center pt-20 pb-16 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
          Turn Chaos into <span className="text-blue-600">Actionable Tasks</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Stop typing manually. Upload photos of your whiteboard, meeting notes, or messy scribbles. 
          Our AI instantly converts them into a structured To-Do list.
        </p>
        
        <div className="flex justify-center gap-4">
          <Link 
            to={user ? "/dashboard" : "/register"}
            className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-blue-700 hover:-translate-y-1 transition flex items-center gap-2"
          >
            Try it for Free <ArrowRight size={20} />
          </Link>
        </div>
        
        <p className="mt-4 text-sm text-gray-400">No credit card required for Beta testers.</p>
      </div>

      {/* 功能介绍 (Features) */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why choose Technology OCR?</h2>
            <p className="text-gray-500 mt-2">Designed for productive teams and individuals.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Image size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">AI OCR Recognition</h3>
              <p className="text-gray-500 leading-relaxed">
                Advanced AI model understands handwriting and complex layouts, not just printed text.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6">
                <ListTodo size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Task Extraction</h3>
              <p className="text-gray-500 leading-relaxed">
                Automatically identifies actionable items, dates, and priorities from your images.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Workflow Automation</h3>
              <p className="text-gray-500 leading-relaxed">
                Save extracted items directly to your task board. Manage everything in one place.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-gray-500 border-t bg-white">
        <div className="mb-4">
          <span className="font-bold text-gray-900 text-lg">Technology OCR</span>
        </div>
        <p className="mb-4">© {new Date().getFullYear()} Technology OCR. All rights reserved.</p>
        <div className="space-x-6">
          <Link to="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-blue-600 transition">Terms of Service</Link>
          <Link to="/contact" className="hover:text-blue-600 transition">Contact Us</Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;