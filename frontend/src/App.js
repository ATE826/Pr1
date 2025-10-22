import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Страницы
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Защищённые страницы
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfilePage";
import Objects from "./pages/ObjectsPage";
import Defects from "./pages/DefectsPage";
import AddObject from "./pages/AddObjectPage"

function App() {
  const [token, setTokenState] = useState(localStorage.getItem("token"));
  const [role, setRoleState] = useState(localStorage.getItem("role"));

  const setToken = (newToken, newRole) => {
    if (newToken && newRole) {
      localStorage.setItem("token", newToken);
      localStorage.setItem("role", newRole);
      setTokenState(newToken);
      setRoleState(newRole);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setTokenState(null);
      setRoleState(null);
    }
  };

  const ProtectedRoute = ({ children }) => {
    if (!token || !role) return <Navigate to="/login" />;
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Главная страница */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Публичные маршруты */}
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route path="/register" element={<RegisterPage setToken={setToken} />} />

        {/* Защищённые маршруты */}
        <Route
          path="/:role/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:role/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:role/objects"
          element={
            <ProtectedRoute>
              <Objects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:role/object/:id"
          element={
            <ProtectedRoute>
              <Defects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:role/object/add-object"
          element={
            <ProtectedRoute>
              <AddObject />
            </ProtectedRoute>
          }
        />

        {/* Любой другой путь редиректит на login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
