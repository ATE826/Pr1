import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { useState } from "react";

function App() {
  const [token, setTokenState] = useState(localStorage.getItem("token"));

  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setTokenState(newToken);
    } else {
      localStorage.removeItem("token");
      setTokenState(null);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Передаём setToken сюда */}
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route path="/register" element={<RegisterPage setToken={setToken} />} />

        {/* Передаём setToken и сюда (для logout) */}
        <Route
          path="/home"
          element={
            token ? <HomePage setToken={setToken} /> : <Navigate to="/login" />
          }
        />

        {/* Добавить другие защищенные маршруты здесь */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
