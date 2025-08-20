import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../Pages/Login.jsx";


export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <Routes>
          <Route path="/" element={<Login />} />
          {/* Remove or comment out the Signup route until the component is created */}
          {/* <Route path="/signup" element={<Signup />} /> */}
        </Routes>
      </div>
    </Router>
  );
}
