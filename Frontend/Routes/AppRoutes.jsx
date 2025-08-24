import react from "react";
import { Route,BrowserRouter,Routes } from "react-router-dom";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import Signup from "../Pages/Signup";
const appRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Signup/>} />
            </Routes>
        </BrowserRouter>
    );
};
export default appRoutes;
