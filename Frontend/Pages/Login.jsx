import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, KeyRound, UserRoundPlus } from "lucide-react";
import axiosInstance from "../src/config/axios.js";
import { useNavigate } from "react-router-dom";
import { useUser } from "../src/context/user.context.jsx";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login } = useUser();

  async function handleSubmit(e) {
    e.preventDefault();
    const toastId = toast.loading(isLogin ? 'Logging in...' : 'Creating account...');
    
    if (!email || !password) {
      toast.error('Please fill in all fields', { id: toastId });
      return;
    }
    
    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.success) {
          toast.success('Login successful!', { id: toastId });
          navigate("/");
        } else {
          toast.error(result.error || 'Invalid email or password', { id: toastId });
        }
      } else {
        const response = await axiosInstance.post("/user/register", { email, password });
        toast.success('Account created successfully! Please log in.', { 
          id: toastId,
          duration: 3000
        });
        setIsLogin(true);
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      let errorMessage = isLogin ? 'Login failed' : 'Signup failed';
      
      if (err.response) {
        if (err.response.data?.errors) {
          errorMessage = Object.values(err.response.data.errors).join('\n');
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = JSON.stringify(err.response.data) || errorMessage;
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      toast.error(errorMessage, { 
        id: toastId,
        duration: 5000,
        style: { maxWidth: '500px', wordBreak: 'break-word', whiteSpace: 'pre-line' }
      });
    }
  }

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

  const toggleView = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-800">
      <motion.div
        key={isLogin ? "login" : "signup"}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md bg-gray-900 rounded-lg p-6 sm:p-8 border border-gray-700 mx-4"
      >
        {/* Header Icon */}
        <div className="flex items-center justify-center mb-6">
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, duration: 0.3 }}
          >
            {isLogin ? (
              <KeyRound size={32} className="text-gray-300" />
            ) : (
              <UserRoundPlus size={32} className="text-gray-300" />
            )}
          </motion.div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-gray-100">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            {isLogin ? "Enter your credentials to access your account" : "Create an account to get started"}
          </p>
        </div>

        {/* Form */}
        <motion.form onSubmit={handleSubmit} variants={containerVariants} className="space-y-4">
          {/* Email */}
          <motion.div variants={itemVariants} className="relative">
            <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email address"
              className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-sm"
            />
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants} className="relative">
            <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-sm"
            />
          </motion.div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={itemVariants}
            type="submit"
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200"
          >
            {isLogin ? "Continue" : "Create account"}
          </motion.button>
        </motion.form>

        {/* Toggle */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            onClick={toggleView}
            className="ml-1 font-medium text-gray-200 hover:text-white transition duration-200"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;