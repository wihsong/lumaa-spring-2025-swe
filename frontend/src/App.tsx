// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";

const App: React.FC = () => {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>{" "}
        {!token && <Link to="/login">Login</Link>}{" "}
        {!token && <Link to="/register">Register</Link>}{" "}
        {token && <Link to="/tasks">Tasks</Link>}{" "}
        {token && <button onClick={handleLogout}>Logout</button>}
      </nav>

      <Routes>
        <Route path="/" element={<h1>Welcome to the Task App!</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </Router>
  );
};

export default App;
