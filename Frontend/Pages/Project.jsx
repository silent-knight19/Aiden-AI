import React, { useState } from "react";

const Project = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Sample user data with more users to demonstrate scrolling
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
    { id: 4, name: "Alice Brown", email: "alice@example.com" },
    { id: 5, name: "Charlie Wilson", email: "charlie@example.com" },
    { id: 6, name: "Diana Miller", email: "diana@example.com" },
    { id: 7, name: "Edward Davis", email: "edward@example.com" },
    { id: 8, name: "Fiona Garcia", email: "fiona@example.com" },
    { id: 9, name: "George Rodriguez", email: "george@example.com" },
    { id: 10, name: "Hannah Martinez", email: "hannah@example.com" },
  ];

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  return (
    <main className="h-screen w-screen bg-gray-800 text-gray-100 flex overflow-hidden">
      {/* Collaborators Side Panel */}
      <div
        className={`collaborators-panel absolute top-0 left-0 h-full w-80 bg-gray-900 border-r border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
          isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        data-name="collaborators-side-panel"
      >
        {/* Panel Header with Close Button */}
        <div 
          className="panel-header p-5 border-b border-gray-700 flex justify-between items-center"
          data-name="collaborators-panel-header"
        >
          <h2 className="panel-title text-lg font-semibold text-gray-100">
            Users
          </h2>
          <button
            onClick={() => setIsSidePanelOpen(false)}
            className="close-panel-button p-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
            data-name="close-collaborators-panel-button"
          >
            <i className="ri-close-line text-xl text-gray-400"></i>
          </button>
        </div>

        {/* Panel Content */}
        <div 
          className="panel-content p-4 overflow-y-auto h-[calc(100%-4rem)] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
          data-name="collaborators-panel-content"
        >
          <div 
            className="collaborators-list space-y-3"
            data-name="collaborators-list-container"
          >
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="collaborator-item flex items-center gap-3 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
                data-name={`collaborator-item-${item}`}
              >
                <div 
                  className="collaborator-avatar w-10 h-10 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-gray-300 font-semibold"
                  data-name={`collaborator-avatar-${item}`}
                >
                  U{item}
                </div>
                <div 
                  className="collaborator-info"
                  data-name={`collaborator-info-${item}`}
                >
                  <h3 className="collaborator-name font-medium text-gray-200">
                    User {item}
                  </h3>
                  <p className="collaborator-email text-sm text-gray-400">
                    user{item}@example.com
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <section
        className={`chat-section h-full flex flex-col w-80 bg-gray-900 flex-shrink-0 border-r border-gray-700 transition-opacity duration-300 ease-in-out ${
          isSidePanelOpen ? "opacity-30 pointer-events-none" : ""
        }`}
        data-name="chat-section"
      >
        {/* Chat Header */}
        <header 
          className="chat-header p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900"
          data-name="chat-header"
        >
          <button 
            onClick={() => setIsModalOpen(true)}
            className="add-button p-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
            data-name="open-user-modal-button"
          >
            <i className="ri-add-line text-xl text-gray-300">
              Add User
            </i>
          </button>
          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="collaborators-button p-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
            data-name="toggle-collaborators-panel-button"
          >
            <i className="ri-group-fill text-xl text-gray-300">Users</i>
          </button>
        </header>

        {/* Conversation Area */}
        <div 
          className="conversation-area flex-grow flex flex-col"
          data-name="conversation-area"
        >
          <div 
            className="messages-container flex-grow p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
            data-name="messages-container"
          >
            <div 
              className="incoming-message p-4 bg-gray-700 rounded-lg max-w-[80%] w-fit"
              data-name="incoming-message"
            >
              <div 
                className="message-content"
                data-name="incoming-message-content"
              >
                <small className="text-xs text-gray-400">User</small>
                <p className="text-sm text-gray-100 leading-relaxed break-words">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  euismod, sapien in rhoncus tincidunt
                </p>
              </div>
            </div>
            <div 
              className="sending-message ml-auto p-4 bg-blue-600 rounded-lg max-w-[80%] w-fit"
              data-name="sending-message"
            >
              <div 
                className="message-content"
                data-name="sending-message-content"
              >
                <small className="text-xs text-gray-300">You</small>
                <p className="text-sm text-white leading-relaxed break-words">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  euismod, sapien in rhoncus tincidunt
                </p>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div 
            className="input-area-container w-full p-4 bg-gray-900 border-t border-gray-700"
            data-name="input-area-container"
          >
            <div 
              className="input-area flex gap-2"
              data-name="input-area"
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="message-input flex-grow px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                type="text"
                placeholder="Type your message..."
                data-name="message-input"
              />
              <button 
                className="send-button p-3 rounded-lg bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-200 transition-colors duration-200 flex items-center justify-center"
                data-name="send-message-button"
              >
                <i className="ri-send-plane-fill text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section 
        className="main-content h-full w-full bg-gray-800 flex-grow"
        data-name="main-content-area"
      ></section>

      {/* User Selection Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4"
          data-name="user-selection-modal-overlay"
        >
          <div 
            className="bg-gray-900 rounded-lg w-full max-w-md max-h-[90vh] flex flex-col border border-gray-700"
            data-name="user-selection-modal"
          >
            {/* Modal Header */}
            <div 
              className="p-4 border-b border-gray-700 flex justify-between items-center"
              data-name="user-modal-header"
            >
              <h2 className="text-lg font-semibold text-gray-100">Select Users</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                data-name="close-user-modal-button"
              >
                <i className="ri-close-line text-xl text-gray-400"></i>
              </button>
            </div>

            {/* Modal Content with scrollable user list */}
            <div 
              className="flex-grow p-4"
              data-name="user-modal-content"
            >
              {/* Scrollable User List Container */}
              <div 
                className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2"
                data-name="user-list-scroll-container"
              >
                <div 
                  className="space-y-3"
                  data-name="user-modal-list-container"
                >
                  {users.map(user => (
                    <div
                      key={user.id}
                      onClick={() => toggleUserSelection(user.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                        selectedUsers.includes(user.id)
                          ? "bg-gray-700 border border-gray-500"
                          : "bg-gray-800 hover:bg-gray-700"
                      }`}
                      data-name={`user-selection-item-${user.id}`}
                    >
                      <div 
                        className="w-10 h-10 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-gray-300 font-semibold"
                        data-name={`user-avatar-${user.id}`}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <div 
                        className="flex-grow"
                        data-name={`user-info-${user.id}`}
                      >
                        <h3 className="font-medium text-gray-200 text-sm">{user.name}</h3>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <div 
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                          selectedUsers.includes(user.id)
                            ? "border-green-500 bg-green-500"
                            : "border-gray-500"
                        }`}
                        data-name={`user-selection-indicator-${user.id}`}
                      >
                        {selectedUsers.includes(user.id) && (
                          <i className="ri-check-line text-xs text-white"></i>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Add Users Button - fixed at bottom of modal */}
              <div 
                className="pt-4"
                data-name="add-users-button-container"
              >
                <button
                  onClick={() => {
                    console.log("Selected users:", selectedUsers);
                    setIsModalOpen(false);
                  }}
                  disabled={selectedUsers.length === 0}
                  className={`w-full py-3 px-4 rounded-lg transition-colors duration-200 font-medium ${
                    selectedUsers.length > 0
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                  data-name="add-users-button"
                >
                  Add Users ({selectedUsers.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;