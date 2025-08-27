import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../src/context/user.context";
import axios from "../src/config/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredProject, setHoveredProject] = useState(null);

  const navigate = useNavigate();

  async function createProject(e) {
    e.preventDefault();
    try {
      const res = await axios.post("/projects/create", { name: projectName });
      const created = res?.data?.data;
      if (created) {
        setProjects((prev) => [created, ...prev]);
      } else {
        await fetchProjects();
      }
      setProjectName("");
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchProjects() {
    try {
      setIsLoading(true);
      const res = await axios.get("/projects/all");
      if (res.data.success) {
        setProjects(res.data.data || []);
      } else {
        console.error("Failed to fetch projects:", res.data.error);
      }
    } catch (err) {
      console.error(
        "Error fetching projects:",
        err.response?.data?.error || err.message
      );
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center p-6 border-b border-gray-800/50 backdrop-blur-sm">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Projects
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 text-sm font-medium hidden sm:block">
              Welcome, {user?.name || user?.email?.split('@')[0]}
            </span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/20">
              {user?.name 
                ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() 
                : user?.email 
                  ? user.email[0].toUpperCase() 
                  : 'U'}
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* New Project Card */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 flex flex-col items-center justify-center h-52 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:border-gray-600 hover:bg-gray-800/70 group backdrop-blur-sm"
            >
              <div className="w-14 h-14 rounded-full bg-gray-700/50 flex items-center justify-center mb-4 group-hover:bg-gray-600/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">New Project</h3>
              <p className="text-gray-400 text-sm">Create a new project</p>
            </div>

            {/* Project Cards */}
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div 
                  key={index} 
                  className="bg-gray-800/30 border border-gray-700/30 rounded-2xl p-6 h-52 backdrop-blur-sm animate-pulse"
                >
                  <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-8"></div>
                  <div className="flex justify-between">
                    <div className="h-5 bg-gray-700/50 rounded w-1/3"></div>
                    <div className="h-5 bg-gray-700/50 rounded w-1/4"></div>
                  </div>
                </div>
              ))
            ) : (
              projects.map((project) => (
                <div
                  key={project._id}
                  onMouseEnter={() => setHoveredProject(project._id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => {
                    navigate(`/project`, {
                      state: { project },
                    });
                  }}
                  className="bg-gray-800/30 border border-gray-700/30 rounded-2xl p-6 flex flex-col justify-between h-52 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:border-gray-600 hover:bg-gray-800/50 backdrop-blur-sm relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">{project.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Last modified: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center relative z-10 pt-2">
                    <div className="flex items-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-sm">{project?.users?.length ?? 0} members</span>
                    </div>
                    <div className={`flex items-center transition-all duration-300 ${hoveredProject === project._id ? 'text-blue-400' : 'text-gray-400'}`}>
                      <span className="text-sm mr-1 font-medium">Open</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${hoveredProject === project._id ? 'translate-x-1' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4">
          <div 
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-700/50 bg-gray-800/30">
              <h2 className="text-2xl font-bold text-white">Create New Project</h2>
              <p className="text-gray-400 mt-1">Start a new project workspace</p>
            </div>
            
            <form onSubmit={createProject} className="p-6">
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 text-sm font-medium">Project Name</label>
                <input
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName || ""}
                  type="text"
                  className="w-full px-4 py-3.5 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 outline-none transition-all backdrop-blur-sm"
                  placeholder="Enter project name"
                  required
                  autoFocus
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-300 hover:text-white rounded-xl transition-colors hover:bg-gray-700/50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;