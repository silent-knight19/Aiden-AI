import React, { useState } from 'react';
import { FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import '../src/App.css';

const Home = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I assist you today?', sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: 'I received your message. This is a simulated response.',
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <h1 className="text-xl font-semibold text-gray-800">Aiden AI</h1>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start max-w-3xl rounded-lg px-4 py-2 ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white rounded-br-none' 
                  : 'bg-white border border-gray-200 rounded-bl-none'
              }`}
            >
              {message.sender === 'ai' && (
                <div className="mr-2 mt-1 text-blue-500">
                  <FiMessageSquare size={18} />
                </div>
              )}
              <p className="text-sm">{message.text}</p>
              {message.sender === 'user' && (
                <div className="ml-2 mt-1">
                  <FiUser size={18} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors duration-200 flex items-center"
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