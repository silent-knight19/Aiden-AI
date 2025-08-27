import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axiosInstance.get('/user/profile');
          const userData = response.data.user;
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/user/login', {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};