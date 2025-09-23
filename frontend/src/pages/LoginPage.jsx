import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import '../css/LoginPage.css';
import FormInput from "../components/FormInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/login", { email, password });
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (err) {
      setError("Неверный email или пароль");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-form-container">
          <p className="login-title">Вход</p>
          <form onSubmit={handleLogin} className="login-form">
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите ваш email"
            />
            <FormInput
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите ваш пароль"
            />
            <p>Ещё нет аккаунта?{" "}
              <Link to="/register" className="register-link">Зарегистрируйтесь!</Link>
            </p>
            <button type="submit" className="login-button">Войти</button>
          </form>
        </div>
      </div>
    </div>
  );
}
