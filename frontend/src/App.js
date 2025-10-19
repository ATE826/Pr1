import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Страницы
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Профили по ролям
import EngineerProfile from "./pages/EngineerProfile";
import ManagerProfile from "./pages/ManagerProfile";
import VisitorProfile from "./pages/VisitorProfile";

function App() {
  // Токен авторизации
  const [token, setTokenState] = useState(localStorage.getItem("token"));

  // Функция для установки токена (используется на LoginPage)
  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setTokenState(newToken);
    } else {
      localStorage.removeItem("token");
      setTokenState(null);
    }
  };

  // === ProtectedRoute прямо здесь ===
  // Защищает маршруты от неавторизованных пользователей
  const ProtectedRoute = ({ children }) => {
    if (!token) return <Navigate to="/login" />;
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

        {/* Защищённые страницы профиля */}
        <Route
          path="/engineer/profile"
          element={
            <ProtectedRoute>
              <EngineerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/profile"
          element={
            <ProtectedRoute>
              <ManagerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visitor/profile"
          element={
            <ProtectedRoute>
              <VisitorProfile />
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
