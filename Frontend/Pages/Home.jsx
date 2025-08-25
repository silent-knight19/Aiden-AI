import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../src/context/user.context";
import axios from "../src/config/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState(null);
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  async function createProject(e) {
    e.preventDefault();
    try {
      const res = await axios.post("/create", { name: projectName });
      console.log(res);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await axios.get("/projects"); // Note: You'll need to implement this endpoint in the backend
        setProjects(res.data.projects);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProjects();
  }, []);

  return (
    <main className="p-4 bg-slate-100">
      <div className="container flex flex-wrap gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="new-project bg-blue-600 text-white p-4 rounded-md"
        >
          New Project
          <i className="ri-link ml-2"></i>
        </button>

        {projects.map((project) => (
          <div
            key={project._id}
            onClick={() => {
              navigate(`/project`, {
                state: { project },
              });
            }}
            className="project flex flex-col gap-2 cursor-pointer bg-slate-200 p-4 rounded-md min-w-52 hover:bg-slate-300"
          >
            <h2 className="project-name font-semibold">{project.name}</h2>

            <div className="project-info flex gap-2">
              <p>
                {" "}
                <small>
                  {" "}
                  <i className="ri-user-line text-gray-500"></i> Collaborators
                </small>{" "}
                :
              </p>
              <span className="text-gray-500">{project.users.length}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="modal bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-3 text-blue-600">
              Create New Project
            </h2>
            <form onSubmit={createProject}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName || ''}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div className="flex justify-between gap-2 mt-4">
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 ml-3 py-2 bg-red-600 text-white rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 ml-10 bg-blue-600 text-white rounded-md"
                  >
                    Create
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
