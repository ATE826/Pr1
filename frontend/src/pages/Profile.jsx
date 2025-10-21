import { useEffect, useState } from "react";
import API from "../api";
import "../css/ProfilePage.css";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { role } = useParams(); // получаем роль из URL

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Нет токена авторизации");

        const response = await API.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.data || Object.keys(response.data).length === 0) {
          setError("Пользователь не найден");
          setUser(null);
        } else {
          setUser(response.data);
        }
      } catch (err) {
        console.error(err);
        setError("Ошибка при получении данных пользователя");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-card-container">
          <div className="navbar-container">
            <div className="navbar-content">
              <Link className="hrefToPage" to={`/${role}/objects`}>Объекты</Link>
              <p className="pageName">Профиль</p>
            </div>
          </div>
          <div className="profile-body">
            <div className="info-container">
              <p>Добро пожаловать в центр контроля строительных дефектов!</p>
              <div className="user-all-nfo">
                <div className="user-info"><p>Имя: {user.first_name}</p></div>
                <div className="user-info"><p>Фамилия: {user.last_name}</p></div>
                <div className="user-info"><p>Отчество: {user.patronymic}</p></div>
                <div className="user-info"><p>Email: {user.email}</p></div>
                <div className="user-info"><p>Должность: {user.role}</p></div>
              </div>
            </div>
            <div className="btns">
              <button className="edit-profile-button">Изменить</button>
              <button className="logout-button" onClick={handleLogout}>Выйти</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
