import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Страницы
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Профили по ролям
import Profile from "./pages/Profile";

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
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
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
