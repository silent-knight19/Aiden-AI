import React, { useState } from "react";

const Project = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <main className="h-screen w-screen bg-[#343541] text-gray-100 flex overflow-hidden">
      {/* Chat Section */}
      <section className="chat-section h-full flex flex-col w-126 bg-[#202123] flex-shrink-0 border-r border-gray-500">
        {/* Chat Header */}
        <header className="chat-header p-2 border-b border-gray-700 flex justify-between items-center bg-[#202123]">
          <h1 className="text-xl font-semibold text-gray-200">
            Project Chat
          </h1>
          <button 
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="collaborators-button p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <i className="ri-group-fill text-2xl text-gray-300"></i>
          </button>
        </header>
        
        {/* Conversation Area */}
        <div className="conversation-area  flex-grow flex flex-col">
          {/* Messages Container */}
          <div className="messages-container flex-grow p-4 overflow-y-auto">
            {/* Empty state */}
            
            <div className="incoming-message p-3 bg-gray-700 rounded-lg flex-grow flex flex-col mb-2 max-w-[70%] w-fit">
                <div className="message-content">
                   <small className="text-xs text-gray-400">User</small>
                   <p className="text-medium">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, sapien in rhoncus tincidunt</p>
                </div>
              
            </div>
            <div className="sending-message mt-2 ml-auto p-3 bg-gray-700 rounded-lg flex-grow  flex flex-col mb-2 max-w-[70%] w-fit">
                <div className="message-content">
                   <small className="text-xs text-gray-400">User</small>
                   <p className="text-medium">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, sapien in rhoncus tincidunt</p>
                </div>
              
            </div>
          </div>
          
          {/* Input Area */}
          <div className="input-area-container w-full p-4 bg-[#202123] border-t border-gray-700">
            <div className="input-area flex gap-2">
              <input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="message-input flex-grow px-4 py-3 rounded-lg bg-[#40414f] border border-gray-600 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all text-gray-200 placeholder-gray-400" 
                type="text" 
                placeholder="Type your message..." 
              />
              <button className="send-button p-3 rounded-lg bg-[#40414f] hover:bg-[#202123] border border-gray-600 text-gray-200 transition-colors flex items-center justify-center">
                <i className="ri-send-plane-fill text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content Area - Blank with ChatGPT background */}
      <section className="main-content h-full w-full bg-[#343541] flex-grow">
        {/* Intentionally left blank */}
      </section>
      
      {/* Collaborators Side Panel */}
      <div className={`collaborators-panel fixed inset-y-0 right-0 w-80 bg-[#202123] border-l border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${isSidePanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Panel Header */}
        <div className="panel-header p-5 border-b border-gray-700 flex justify-between items-center">
          <h2 className="panel-title text-xl font-semibold text-gray-200">Collaborators</h2>
          <button 
            onClick={() => setIsSidePanelOpen(false)}
            className="close-panel-button p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <i className="ri-close-line text-2xl text-gray-400"></i>
          </button>
        </div>
        
        {/* Panel Content */}
        <div className="panel-content p-5">
          <div className="collaborators-list space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="collaborator-item flex items-center gap-3 p-3 rounded-lg bg-[#40414f] hover:bg-[#202123] transition-colors">
                <div className="collaborator-avatar w-10 h-10 rounded-full bg-[#202123] border border-gray-600 flex items-center justify-center text-gray-300 font-semibold">
                  U{item}
                </div>
                <div className="collaborator-info">
                  <h3 className="collaborator-name font-medium text-gray-200">User {item}</h3>
                  <p className="collaborator-email text-xs text-gray-400">user{item}@example.com</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Overlay */}
      {isSidePanelOpen && (
        <div 
          className="overlay fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidePanelOpen(false)}
        ></div>
      )}
    </main>
  );
};

export default Project;