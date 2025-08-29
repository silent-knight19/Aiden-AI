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
    <main className="min-h-screen w-full bg-gray-800 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 px-4 sm:px-6 py-4 flex justify-between items-center flex-shrink-0">
        <h1 className="text-xl font-semibold text-gray-100">Projects</h1>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-300 hidden md:block">
            {user?.name || user?.email?.split('@')[0]}
          </span>
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-300">
            {(user?.name || user?.email)?.[0].toUpperCase()}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {/* Create New Project Card */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="group bg-gray-900 border border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center min-h-[12rem] cursor-pointer transition-all duration-200 hover:border-gray-600 hover:bg-gray-800/50"
            >
              <div className="w-12 h-12 rounded-full bg-gray-700 group-hover:bg-gray-600 flex items-center justify-center mb-3 transition-colors">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-100 mb-1">Create new project</h3>
              <p className="text-sm text-gray-500">Start from scratch</p>
            </div>

            {/* Existing Projects */}
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-900 rounded-xl p-6 space-y-4">
                  <div className="h-5 bg-gray-700 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse" />
                  <div className="pt-4 flex justify-between">
                    <div className="h-4 bg-gray-700 rounded w-1/3 animate-pulse" />
                    <div className="h-4 bg-gray-700 rounded w-1/4 animate-pulse" />
                  </div>
                </div>
              ))
            ) : (
              projects.map((project) => (
                <div
                  key={project._id}
                  onMouseEnter={() => setHoveredProject(project._id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => navigate("/project", { state: { project } })}
                  className="bg-gray-900 rounded-xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:bg-gray-800 border border-transparent hover:border-gray-700 min-h-[12rem]"
                >
                  <div>
                    <h3 className="font-medium text-gray-100 mb-2 line-clamp-2">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(project.updatedAt || project.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                    <span>{project?.users?.length || 0} members</span>
                    <span className={`transition-colors ${hoveredProject === project._id ? 'text-gray-300' : ''}`}>
                      Open →
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-md border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-gray-100">Create new project</h2>
              <p className="text-sm text-gray-500 mt-1">Give your project a name to get started.</p>
            </div>
            <form onSubmit={createProject} className="p-6">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project name"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                autoFocus
              />
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Create
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