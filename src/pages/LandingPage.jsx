import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { CheckCircle, Zap, Image, ListTodo, ArrowRight, Star } from "lucide-react";

const LandingPage = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* 顶部通告 */}
      <div className="bg-indigo-600 text-white text-center py-2 px-4 text-sm font-medium">
        🚀 <span className="font-bold">Public Beta is Live!</span> Use code <span className="bg-white text-indigo-600 px-1 rounded mx-1 font-bold">TEST</span> at checkout to get PRO features for FREE.
      </div>

      {/* 导航 */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="text-2xl font-extrabold text-blue-600 flex items-center gap-2">
          <Zap size={28} /> Technology OCR
        </div>
        <div className="space-x-4 flex items-center">
          {user ? (
            <Link to="/dashboard" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium hidden sm:inline-block">
                Log in
              </Link>
              <Link to="/register" className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
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
        <p className="mt-4 text-sm text-gray-400">6 Free credits per month • No credit card required</p>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6"><Image size={24} /></div>
              <h3 className="text-xl font-bold mb-3">AI OCR Recognition</h3>
              <p className="text-gray-500">Reads messy scribbles and complex layouts, not just printed text.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6"><ListTodo size={24} /></div>
              <h3 className="text-xl font-bold mb-3">Smart Task Extraction</h3>
              <p className="text-gray-500">Auto-identifies actionable items, dates, and priorities.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6"><CheckCircle size={24} /></div>
              <h3 className="text-xl font-bold mb-3">Workflow Automation</h3>
              <p className="text-gray-500">Manage everything in one place with a built-in Kanban board.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 新增：Pricing Section (关键！) */}
      <div id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="text-gray-500 mt-2">Start for free, upgrade when you need more power.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="border border-gray-200 rounded-2xl p-8 hover:border-blue-200 transition">
              <h3 className="text-xl font-bold text-gray-900">Free Starter</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900">$0</span>
                <span className="ml-1 text-gray-500">/ month</span>
              </div>
              <p className="mt-4 text-gray-500">Perfect for trying out the power of AI OCR.</p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center text-gray-600"><CheckCircle size={18} className="text-blue-600 mr-2"/> 6 AI credits per month</li>
                <li className="flex items-center text-gray-600"><CheckCircle size={18} className="text-blue-600 mr-2"/> Basic task management</li>
              </ul>
              <Link to="/register" className="mt-8 block w-full py-3 px-4 bg-gray-100 text-gray-900 font-bold text-center rounded-lg hover:bg-gray-200 transition">
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-blue-600 rounded-2xl p-8 relative shadow-xl">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">MOST POPULAR</div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Pro Unlimited <Star size={18} className="text-yellow-400 fill-yellow-400"/>
              </h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900">$9.9</span>
                <span className="ml-1 text-gray-500">/ month</span>
              </div>
              <p className="mt-4 text-gray-500">For professionals who need unlimited productivity.</p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center text-gray-900 font-medium"><CheckCircle size={18} className="text-green-500 mr-2"/> Unlimited AI OCR</li>
                <li className="flex items-center text-gray-900 font-medium"><CheckCircle size={18} className="text-green-500 mr-2"/> Priority Support</li>
                <li className="flex items-center text-gray-900 font-medium"><CheckCircle size={18} className="text-green-500 mr-2"/> Advanced Model (GPT-4o/Qwen)</li>
              </ul>
              <Link to="/register" className="mt-8 block w-full py-3 px-4 bg-blue-600 text-white font-bold text-center rounded-lg hover:bg-blue-700 transition shadow-lg">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-gray-500 border-t bg-gray-50">
        <div className="mb-4">
          <span className="font-bold text-gray-900 text-lg">Technology OCR</span>
        </div>
        <p className="mb-4">© 2026 All rights reserved.</p>
        <div className="space-x-6">
          <Link to="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-blue-600 transition">Terms of Service</Link>
          <Link to="/contact" className="hover:text-blue-600 transition">Contact Us</Link>
        </div>

         <div className="mt-4 opacity-50 hover:opacity-100 transition text-xs">
          <a href="https://dang.ai/" target="_blank" rel="noreferrer">
            <img 
              src="https://cdn.prod.website-files.com/63d8afd87da01fb58ea3fbcb/6487e2868c6c8f93b4828827_dang-badge.png" 
              alt="Dang.ai" 
              style={{ width: '150px', height: '54px' }} 
              width="150" 
              height="54" 
            />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;