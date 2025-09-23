import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import '../css/RegisterPage.css';
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";

export default function RegisterPage() {
  const [form, setForm] = useState({
    role: "engineer",
    first_name: "",
    last_name: "",
    patronymic: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/register", form);
      navigate("/login");
    } catch (err) {
      setError("Ошибка регистрации. Попробуйте еще раз.");
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="register-form-container">
          <p className="register-title">Регистрация</p>
          <form onSubmit={handleRegister} className="register-form">
            <FormSelect id="role"
              label="Роль"
              name="role"
              value={form.role}
              onChange={handleChange}
              options={[
                { value: "engineer", label: "Инженер" },
                { value: "manager", label: "Менеджер" },
                { value: "leader", label: "Руководитель" },
                { value: "visitor", label: "Заказчик" },
              ]}
            />
            <FormInput
              label="Имя"
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="Введите имя"
            />
            <FormInput
              label="Фамилия"
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Введите фамилию"
            />
            <FormInput
              label="Отчество"
              type="text"
              name="patronymic"
              value={form.patronymic}
              onChange={handleChange}
              placeholder="Введите отчество"
            />
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Введите ваш email"
            />
            <FormInput
              label="Пароль"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Введите ваш пароль"
            />
            
            {error && <p className="error-message">{error}</p>}

            <p>
              Есть аккаунт?{" "}
              <Link to="/login" className="login-link">
                Войдите!
              </Link>
            </p>

            <button type="submit" className="register-button">
              Зарегистрироваться
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
