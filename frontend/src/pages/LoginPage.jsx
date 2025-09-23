import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import '../css/LoginPage.css';
import FormInput from "../components/FormInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
 
    try {
      const response = await API.post("/login", { 
        email: email.trim(), 
        password: password.trim(),
      });
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (err) {
      setError("Неверный email или пароль");
      setEmail("");
      setPassword("");
      console.error(err);
    } finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-form-container">
          <p className="login-title">Вход</p>
          <form onSubmit={handleLogin} className="login-form">
            <div className="field-container">
              <FormInput
                label="Email"
                type="email"
                name="email"
                autoComplete="new-password"
                //value={email}
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите ваш email"
              />
              <FormInput
                label="Пароль"
                type="password"
                name="password"
                autoComplete="new-password"
                //value={password}
                defaultValue={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите ваш пароль"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <p>Ещё нет аккаунта?{" "}
              <Link to="/register" className="register-link">Зарегистрируйтесь!</Link>
            </p>
            <button type="submit" className="login-button">
              {isLoading ? "Вход..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
