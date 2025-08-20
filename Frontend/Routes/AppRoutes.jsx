import react from "react";
import { Route,BrowserRouter,Routes } from "react-router-dom";
import Login from "../Pages/Login";
const appRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>Home</div>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<div>Register</div>} />
            </Routes>
        </BrowserRouter>
    );
};
export default appRoutes;
