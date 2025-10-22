import { useEffect, useState } from "react";
import API from "../api";
import "../css/ProfilePage.css";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProfilePage() {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    patronymic: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { role } = useParams(); // используем только для навигации
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) throw new Error("Нет токена авторизации");

        const response = await API.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.data) {
          setError("Пользователь не найден");
        } else {
          setUser({
            first_name: response.data.first_name || "",
            last_name: response.data.last_name || "",
            patronymic: response.data.patronymic || "",
            email: response.data.email || "",
          });
        }
      } catch (err) {
        console.error(err);
        setError("Ошибка при получении данных пользователя");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // <-- Важно: URL без роли, как на бэке
      await API.patch("/profile/edit", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Профиль успешно обновлён!");
      navigate(`/${role}/profile`); // используем роль только для навигации
    } catch (err) {
      console.error(err);
      alert("Ошибка при сохранении профиля");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-card-container">
          <div className="navbar-container">
            <div className="navbar-content">
              <p className="pageName">Редактирование профиля</p>
            </div>
          </div>

          <div className="profile-body">
            <div className="edit-inputs">
              <input
                type="text"
                name="first_name"
                placeholder="Имя"
                value={user.first_name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="last_name"
                placeholder="Фамилия"
                value={user.last_name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="patronymic"
                placeholder="Отчество"
                value={user.patronymic}
                onChange={handleChange}
              />
              <input
                type="text"
                name="email"
                placeholder="Почта"
                value={user.email}
                onChange={handleChange}
              />
            </div>
            <div className="btns">
              <button
                className="edit-profile-button"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
              <button
                className="logout-button"
                onClick={() => navigate(`/${role}/profile`)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
