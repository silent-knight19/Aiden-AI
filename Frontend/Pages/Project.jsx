import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Project = () => {
  const navigate = useNavigate();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  return (
    <main className="h-screen w-screen flex bg-gray-900 text-white relative">
      {/* Permanent Sidebar */}
      <section className="left-sidebar flex flex-col w-80 h-full bg-gray-800 border-r border-gray-700">
        {/* Header */}
        <header className="h-16 flex justify-end items-center px-3 bg-gray-700 shadow-md">
          <button
            className="text-gray-300 hover:text-white transition-colors duration-200"
            onClick={() => setIsSidePanelOpen(true)}
          >
            <i className="ri-group-line text-2xl"></i>
          </button>
        </header>

        {/* Conversation Area */}
        <div className="conversation-area flex-grow flex flex-col justify-end p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {/* Messages */}
          <div className="message-box flex flex-col space-y-3">
            {/* Incoming Message */}
            <div className="incoming-messages flex flex-col items-start">
              <small className="text-xs text-gray-400 mb-1">user</small>
              <div className="message max-w-xs px-4 py-2 rounded-lg bg-gray-700 text-sm shadow-md">
                Hello
              </div>
            </div>

            {/* Outgoing Message */}
            <div className="outgoing-messages flex flex-col items-end">
              <small className="text-xs text-gray-400 mb-1">user2</small>
              <div className="message max-w-xs px-4 py-2 rounded-lg bg-indigo-600 text-sm shadow-md">
                Hello
              </div>
            </div>
          </div>

          {/* Input Field */}
          <div className="input-field mt-4 p-2 flex items-center gap-2 border border-gray-600 rounded-lg bg-gray-800 focus-within:ring-2 focus-within:ring-indigo-500">
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
      </section>

      {/* Overlay Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300 
        ${isSidePanelOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsSidePanelOpen(false)}
      ></div>

      {/* Sliding Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 shadow-xl z-50 
        transform transition-transform duration-600 ease-in-out 
        ${isSidePanelOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Drawer Header */}
        <header className="h-16 flex justify-between items-center px-4 bg-gray-800 shadow-md">
          <h2 className="text-lg font-semibold">User List</h2>
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => setIsSidePanelOpen(false)}
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </header>

        {/* Drawer Content */}
        <div className="p-4 space-y-4">
        </div>
      </div>
    </main>
  );
};

export default Project;
