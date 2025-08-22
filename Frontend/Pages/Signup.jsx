import React from "react";
import { motion } from "framer-motion";
import { Mail, Lock, KeyRound } from "lucide-react";
import { useState } from "react";
import axios from "../src/config/axios.js";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.075,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/signup", { email, password });
      console.log("Signup successful:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen 
                     bg-gradient-to-br from-gray-900 via-gray-950 to-black 
                     text-gray-100 p-6 font-sans">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-lg bg-gray-900/90 backdrop-blur-xl 
                   rounded-3xl shadow-2xl p-10 border border-gray-800"
      >
        {/* Header */}
        <div className="flex items-center justify-center mb-8 space-x-3">
          <KeyRound size={50} className="text-blue-500" />
          <h1 className="text-5xl font-bold text-center text-white">Sign Up</h1>
        </div>

        {/* Login Form */}
        <motion.form 
          onSubmit={handleSubmit}
          variants={containerVariants} 
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="relative">
            <Mail className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-500" size={24}/>
            <input
             value={email}
             onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full pl-14 pr-5 py-4 bg-gray-800 rounded-xl 
                         text-lg text-white placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         transition duration-150"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <Lock className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-500" size={24}/>
            <input
             value={password}
             onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full pl-14 pr-5 py-4 bg-gray-800 rounded-xl 
                         text-lg text-white placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         transition duration-150"
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={itemVariants}
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 
                       text-lg text-white font-semibold rounded-xl 
                       transition duration-150 shadow-lg"
          >
            Sign Up
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default Signup;