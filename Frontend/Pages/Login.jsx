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
    
    // Basic validation
    if (!email || !password) {
      toast.error('Please fill in all fields', { id: toastId });
      return;
    }
    
    try {
      if (isLogin) {
        // Use the login function from context
        const result = await login(email, password);
        if (result.success) {
          toast.success('Login successful!', { id: toastId });
          navigate("/");
        } else {
          toast.error(result.error || 'Invalid email or password', { id: toastId });
        }
      } else {
        // Handle signup
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
        // Handle server validation errors
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
        style: {
          maxWidth: '500px',
          wordBreak: 'break-word',
          whiteSpace: 'pre-line'
        }
      });
    }
  }

  // Animation variants
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
    <div
      className="flex items-center justify-center min-h-screen w-screen
                    bg-gradient-to-br from-gray-900 via-gray-950 to-black
                    text-gray-100 p-6 font-sans"
    >
      <motion.div
        key={isLogin ? "login" : "signup"}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-lg bg-gray-900/90 backdrop-blur-xl
                   rounded-3xl shadow-2xl p-10 border border-gray-800"
      >
        {/* Header with Icon */}
        <div className="flex items-center justify-center mb-8 space-x-3">
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 0.3,
            }}
          >
            {isLogin ? (
              <KeyRound size={50} className="text-blue-500" />
            ) : (
              <UserRoundPlus size={50} className="text-blue-500" />
            )}
          </motion.div>
          <h1 className="text-5xl font-bold text-center text-white">
            {isLogin ? "Login" : "Sign Up"}
          </h1>
        </div>

        {/* Unified Form */}
        <motion.form onSubmit={handleSubmit} variants={containerVariants} className="space-y-8">
          <motion.div variants={itemVariants} className="relative">
            <Mail
              className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-500"
              size={24}
            />
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
            <Lock
              className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-500"
              size={24}
            />
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
            {isLogin ? "Sign In" : "Create Account"}
          </motion.button>
        </motion.form>

        {/* Toggle Button */}
        <div className="mt-8 text-center text-base">
          <p className="text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleView}
              className="ml-2 font-bold text-blue-500 hover:text-blue-400 transition duration-150"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </motion.button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
