import React, { useState, useContext } from "react";
import { FiSend, FiUser, FiMessageSquare, FiSun, FiMoon } from "react-icons/fi";
import "../src/App.css";
import { useUser } from "../src/context/user.context.jsx";
 
const Home = () => {
  const { user } = useUser();
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I assist you today?", sender: "ai" },
  ]);
  const [inputValue, setInputValue] = useState("");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: "I received your message. This is a simulated response.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div
      className={`flex flex-col h-screen transition-colors duration-200 ${
        darkMode ? "dark bg-gray-900 text-gray-100" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Aiden AI
        </h1>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <FiSun className="text-yellow-300" />
          ) : (
            <FiMoon className="text-gray-600" />
          )}
        </button>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start max-w-3xl rounded-lg px-4 py-2 ${
                message.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-none text-gray-800 dark:text-gray-200"
              }`}
            >
              {message.sender === "ai" && (
                <div className="mr-2 mt-1 text-blue-500 dark:text-blue-400">
                  <FiMessageSquare size={18} />
                </div>
              )}
              <p className="text-sm">{message.text}</p>
              {message.sender === "user" && (
                <div className="ml-2 mt-1 text-white">
                  <FiUser size={18} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors duration-200 flex items-center"
          >
            <FiSend className="mr-1" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
