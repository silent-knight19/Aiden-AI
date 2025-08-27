import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../src/context/user.context";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../src/config/axios";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../src/config/socket";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";
import { getWebContainer } from "../src/config/webcontainer";

function SyntaxHighlightedCode(props) {
  const ref = useRef(null);

  React.useEffect(() => {
    if (ref.current && props.className?.includes("lang-") && window.hljs) {
      window.hljs.highlightElement(ref.current);
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  return <code {...props} ref={ref} />;
}

const Project = () => {
  const location = useLocation();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(new Set());
  const [project, setProject] = useState(location.state.project);
  const [message, setMessage] = useState("");
  const { user } = useContext(UserContext);
  const messageBox = React.createRef();

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [fileTree, setFileTree] = useState({});

  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);

  const [webContainer, setWebContainer] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [runProcess, setRunProcess] = useState(null);

  const handleUserClick = (id) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }
      return newSelectedUserId;
    });
  };

  function addCollaborators() {
    axios
      .put("/projects/add-user", {
        projectId: location.state.project._id,
        users: Array.from(selectedUserId),
      })
      .then((res) => {
        console.log(res.data);
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const send = () => {
    sendMessage("project-message", {
      message,
      sender: user,
    });
    setMessages((prevMessages) => [...prevMessages, { sender: user, message }]);
    setMessage("");
  };

  function WriteAiMessage(message) {
    const messageObject = JSON.parse(message);
    return (
      <div className="overflow-auto bg-gray-900 text-white rounded-lg p-3">
        <Markdown
          children={messageObject.text}
          options={{
            overrides: {
              code: SyntaxHighlightedCode,
            },
          }}
        />
      </div>
    );
  }

  useEffect(() => {
    initializeSocket(project._id);

    if (!webContainer) {
      getWebContainer().then((container) => {
        setWebContainer(container);
        console.log("container started");
      });
    }

    receiveMessage("project-message", (data) => {
      console.log(data);

      if (data.sender._id == "ai") {
        const message = JSON.parse(data.message);
        console.log(message);
        webContainer?.mount(message.fileTree);

        if (message.fileTree) {
          setFileTree(message.fileTree || {});
        }
        setMessages((prevMessages) => [...prevMessages, data]);
      } else {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    axios
      .get(`/projects/get-project/${location.state.project._id}`)
      .then((res) => {
        console.log(res.data.project);
        setProject(res.data.project);
        setFileTree(res.data.project.fileTree || {});
      });

    axios
      .get("/users/all")
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function saveFileTree(ft) {
    axios
      .put("/projects/update-file-tree", {
        projectId: project._id,
        fileTree: ft,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function scrollToBottom() {
    messageBox.current.scrollTop = messageBox.current.scrollHeight;
  }

  return (
    <main className="h-screen w-screen flex bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
      <section className="left relative flex flex-col h-screen min-w-96 bg-gray-800/30 backdrop-blur-sm border-r border-gray-700/50">
        <header className="flex justify-between items-center p-4 w-full bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 absolute z-10 top-0">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all font-medium shadow-lg shadow-blue-500/20"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="ri-add-fill"></i>
            <span>Add collaborator</span>
          </button>
          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            <i className="ri-group-fill text-xl"></i>
          </button>
        </header>
        <div className="conversation-area pt-16 pb-14 flex-grow flex flex-col h-full relative">
          <div
            ref={messageBox}
            className="message-box p-4 flex-grow flex flex-col gap-3 overflow-auto max-h-full scrollbar-hide"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.sender._id === "ai" ? "max-w-96" : "max-w-72"
                } ${
                  msg.sender._id == user._id.toString() ? "ml-auto" : "mr-auto"
                } message flex flex-col p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl backdrop-blur-sm`}
              >
                <small className="opacity-75 text-xs mb-1">
                  {msg.sender.email}
                </small>
                <div className="text-sm">
                  {msg.sender._id === "ai" ? (
                    WriteAiMessage(msg.message)
                  ) : (
                    <p className="text-gray-100">{msg.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="inputField w-full flex absolute bottom-0 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700/50 p-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-3 px-4 bg-gray-700/50 border border-gray-600/50 rounded-l-xl outline-none flex-grow text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 transition-all"
              type="text"
              placeholder="Type your message..."
            />
            <button
              onClick={send}
              className="px-5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-r-xl transition-all font-medium shadow-lg shadow-blue-500/20"
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>
        <div
          className={`sidePanel w-full h-full flex flex-col gap-3 bg-gray-800/90 backdrop-blur-sm absolute transition-all duration-300 ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } top-0 z-20 border-r border-gray-700/50`}
        >
          <header className="flex justify-between items-center px-4 p-4 bg-gray-800/70 border-b border-gray-700/50">
            <h1 className="font-semibold text-lg text-white">Collaborators</h1>
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <i className="ri-close-fill text-xl"></i>
            </button>
          </header>
          <div className="users flex flex-col gap-2 p-4">
            {project.users &&
              project.users.map((user) => (
                <div
                  key={user._id}
                  className="user cursor-pointer hover:bg-gray-700/50 p-3 rounded-xl flex gap-3 items-center transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : user.email
                      ? user.email[0].toUpperCase()
                      : "U"}
                  </div>
                  <div>
                    <h1 className="font-medium text-white">
                      {user.name || user.email}
                    </h1>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="right bg-gray-900/50 flex-grow h-full flex">
        <div className="explorer h-full max-w-64 min-w-52 bg-gray-800/30 border-r border-gray-700/50">
          <div className="file-tree w-full">
            {Object.keys(fileTree).map((file, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentFile(file);
                  setOpenFiles([...new Set([...openFiles, file])]);
                }}
                className={`tree-element cursor-pointer p-3 px-4 flex items-center gap-2 w-full text-left transition-colors ${
                  currentFile === file
                    ? "bg-gray-700/50"
                    : "hover:bg-gray-700/30"
                }`}
              >
                <i className="ri-file-text-line text-gray-400"></i>
                <p className="font-medium text-gray-200 truncate">{file}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="code-editor flex flex-col flex-grow h-full">
          <div className="top flex justify-between w-full bg-gray-800/50 border-b border-gray-700/50 p-2">
            <div className="files flex">
              {openFiles.map((file, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFile(file)}
                  className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 transition-colors ${
                    currentFile === file
                      ? "bg-gray-700/70 text-white"
                      : "bg-gray-700/30 text-gray-300 hover:bg-gray-700/50"
                  }`}
                >
                  <i className="ri-file-line"></i>
                  <p className="font-medium">{file}</p>
                </button>
              ))}
            </div>

            <div className="actions flex gap-2">
              <button
                onClick={async () => {
                  await webContainer.mount(fileTree);
                  const installProcess = await webContainer.spawn("npm", [
                    "install",
                  ]);
                  installProcess.output.pipeTo(
                    new WritableStream({
                      write(chunk) {
                        console.log(chunk);
                      },
                    })
                  );

                  if (runProcess) {
                    runProcess.kill();
                  }

                  let tempRunProcess = await webContainer.spawn("npm", [
                    "start",
                  ]);
                  tempRunProcess.output.pipeTo(
                    new WritableStream({
                      write(chunk) {
                        console.log(chunk);
                      },
                    })
                  );

                  setRunProcess(tempRunProcess);

                  webContainer.on("server-ready", (port, url) => {
                    console.log(port, url);
                    setIframeUrl(url);
                  });
                }}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all font-medium shadow-lg shadow-green-500/20"
              >
                Run Project
              </button>
            </div>
          </div>
          <div className="bottom flex flex-grow max-w-full overflow-auto">
            {fileTree[currentFile] && (
              <div className="code-editor-area h-full overflow-auto flex-grow bg-gray-900/50">
                <pre className="hljs h-full">
                  <code
                    className="hljs h-full outline-none p-4 block"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const updatedContent = e.target.innerText;
                      const ft = {
                        ...fileTree,
                        [currentFile]: {
                          file: {
                            contents: updatedContent,
                          },
                        },
                      };
                      setFileTree(ft);
                      saveFileTree(ft);
                    }}
                    dangerouslySetInnerHTML={{
                      __html: hljs.highlight(
                        "javascript",
                        fileTree[currentFile].file.contents
                      ).value,
                    }}
                    style={{
                      whiteSpace: "pre-wrap",
                      paddingBottom: "25rem",
                      counterSet: "line-numbering",
                    }}
                  />
                </pre>
              </div>
            )}
          </div>
        </div>

        {iframeUrl && webContainer && (
          <div className="flex min-w-96 flex-col h-full bg-gray-800/30 border-l border-gray-700/50">
            <div className="address-bar p-2 bg-gray-800/50 border-b border-gray-700/50">
              <input
                type="text"
                onChange={(e) => setIframeUrl(e.target.value)}
                value={iframeUrl}
                className="w-full p-2 px-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-200 outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <iframe
              src={iframeUrl}
              className="w-full h-full bg-white"
              title="Preview"
            ></iframe>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4">
          <div
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-700/50 bg-gray-800/30">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Add Collaborators
                  </h2>
                  <p className="text-gray-400 mt-1">
                    Select users to add to this project
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <i className="ri-close-line text-xl text-gray-400"></i>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="users-list flex flex-col gap-2 mb-6 max-h-96 overflow-auto">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className={`user cursor-pointer hover:bg-gray-700/50 rounded-xl p-3 flex gap-3 items-center transition-colors ${
                      Array.from(selectedUserId).includes(user._id)
                        ? "bg-gray-700/70 border border-gray-600/50"
                        : "bg-gray-700/30"
                    }`}
                    onClick={() => handleUserClick(user._id)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : user.email
                        ? user.email[0].toUpperCase()
                        : "U"}
                    </div>
                    <div>
                      <h1 className="font-medium text-white">
                        {user.name || user.email}
                      </h1>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={addCollaborators}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all font-medium shadow-lg shadow-blue-500/20"
              >
                Add Selected Collaborators
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
