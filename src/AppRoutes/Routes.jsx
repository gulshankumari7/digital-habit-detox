import { Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected dashboard */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <App />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
