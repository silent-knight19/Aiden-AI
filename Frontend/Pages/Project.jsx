import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../src/config/axios.js";
import { toast } from "react-hot-toast";

const Project = () => {
  
  const location = useLocation();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [users,setUsers] = useState([]);


  const handleuserclick = (id) => {
    setSelectedUsers([...selectedUsers, id]);
  };

  function addUsers(){
    axios.put('/project/add-user',{
      projectId: location.state.projectId,
      users: Array.from((selectedUserid))
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  return (
    <main className="h-screen w-screen flex bg-gradient-to-br from-gray-900 to-gray-800 text-white relative">
      {/* Sidebar */}
      <section className="left-sidebar flex flex-col w-102 h-full bg-gray-800/70 backdrop-blur-lg border-r border-gray-700/50 shadow-xl">
      <header className="h-14 flex justify-between items-center px-4 bg-gray-900/60 backdrop-blur-sm">
  {/* Left button */}
  <button
    className="Add-user-btn text-gray-300 hover:text-white transition-all duration-300 p-2 rounded-full hover:bg-gray-700/50"
    onClick={() => setIsModalOpen(true)}
  >
    <i className="ri-user-add-fill text-2xl"></i>
  </button>

  {/* Right button */}
  <button
    className="show-sidebar-btn text-gray-300 hover:text-white transition-all duration-300 p-2 rounded-full hover:bg-gray-700/50"
    onClick={() => setIsSidePanelOpen(true)}
  >
    <i className="ri-menu-fill text-2xl"></i>
  </button>
</header>

        <div className="conversation-area flex-grow flex flex-col justify-end p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/50">
          <div className="message-box flex flex-col space-y-4">
            <div className="incoming-messages flex flex-col items-start">
              <small className="text-xs text-gray-400 mb-1">Sachin</small>
              <div className="message max-w-xs px-4 py-3 rounded-2xl bg-gray-700/80 text-sm shadow-lg">
                Hello there! How are you doing today?
              </div>
            </div>
            <div className="outgoing-messages flex flex-col items-end">
              <small className="text-xs text-gray-400 mb-1">You</small>
              <div className="message max-w-xs px-4 py-3 rounded-2xl bg-indigo-600 text-sm shadow-lg">
                I'm doing great! Thanks for asking.
              </div>
            </div>
          </div>

          <div className="input-field mt-1 p-1 flex items-center gap-2 border border-gray-600/50 rounded-xl bg-gray-800/50 backdrop-blur-sm focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 transition-all duration-300">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400 px-1 py-1"
            />
            <button className="send-button p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg">
              <i className="ri-send-plane-line text-lg"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-700/50 bg-gray-900/60">
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Select Users
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700/50 transition-all duration-300"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {users.map((user) => {
                const isSelected = selectedUsers.includes(user.id);
                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between px-5 py-4 cursor-pointer border-b border-gray-700/30 hover:bg-gray-700/30 transition-all duration-200 ${
                      isSelected ? "bg-indigo-900/20" : ""
                    }`}
                    onClick={() => handleuserclick(user.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 font-bold text-lg shadow-md">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-green-400 bg-green-400/20 p-2 rounded-full">
                        <i className="ri-check-line text-xl"></i>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-4 bg-gray-900/70 border-t border-gray-700/50">
              <button
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedUsers.length === 0}
                onClick={() => setIsModalOpen(false)}
              >
                Add Users ({selectedUsers.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900/90 backdrop-blur-xl shadow-2xl z-40 transform transition-all duration-300 ease-in-out border-r border-gray-700/50 ${
          isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <header className="h-16 flex justify-between items-center px-5 bg-gray-800/60 backdrop-blur-sm shadow-md">
          <h2 className="text-xl font-bold">User List</h2>
          <button
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700/50 transition-all duration-300"
            onClick={() => setIsSidePanelOpen(false)}
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </header>
        <div className="p-5">
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 cursor-pointer"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Project;