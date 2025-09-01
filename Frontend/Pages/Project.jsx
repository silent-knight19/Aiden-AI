import React from "react";
import { useNavigate } from "react-router-dom";

const Project = () => {
  const navigate = useNavigate();
  return (
    <main className="h-screen w-screen flex bg-gray-900 text-white">
      <section className="left-sidebar flex flex-col w-92 h-full bg-gray-800 border-r border-gray-700">
        
        {/* Header */}
        <header className="h-16 flex justify-end items-center px-3 bg-gray-700 shadow-md">
          <button className="text-gray-300 hover:text-white transition-colors duration-200">
            <i className="ri-group-line text-2xl"></i>
          </button>
        </header>

        {/* Conversation Area */}
        <div className="conversation-area flex-grow flex flex-col justify-end p-4 space-y-4 overflow-y-auto">
          
          {/* Message Box */}
          <div className="message-box  rounded-lg backdrop-blur-md">
            
            {/* Input Field */}
            <div className="input-field p-2 flex items-center gap-2 border border-gray-600 rounded-lg bg-gray-800 focus-within:ring-2 focus-within:ring-indigo-500">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400" 
              />
              <button className="send-button p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 cursor-pointer">
                <i className="ri-send-plane-line text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Project;
