import { useEffect, useState } from "react";
import API from "../api";
import "../css/ProfilePage.css";
import "../css/ObjectsPage.css";
import { useNavigate, useParams } from "react-router-dom";

export default function EditObjectPage() {
  const [object, setObject] = useState({
    title: "",
    description: "",
    location: "",
    start_date: "",
    end_date: "",
    status: "active", // значение по умолчанию
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { role, id } = useParams(); // id объекта из URL
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchObject = async () => {
      try {
        if (!token) throw new Error("Нет токена авторизации");

        const response = await API.get(`/${role}/object/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.data) {
          setError("Объект не найден");
        } else {
          setObject({
            title: response.data.title || "",
            description: response.data.description || "",
            location: response.data.location || "",
            start_date: response.data.start_date || "",
            end_date: response.data.end_date || "",
            status: response.data.status || "active",
          });
        }
      } catch (err) {
        console.error(err);
        setError("Ошибка при получении данных объекта");
      } finally {
        setLoading(false);
      }
    };

    fetchObject();
  }, [token, role, id]);

  const handleChange = (e) => {
    setObject({
      ...object,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.patch(`/${role}/object/${id}`, object, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Объект успешно обновлён!");
      navigate(`/${role}/objects`);
    } catch (err) {
      console.error(err);
      alert("Ошибка при сохранении объекта");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Вы уверены, что хотите удалить этот объект вместе со всеми его дефектами?"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (role !== "manager") {
        alert("У Вас нет прав на выполнение этого действия.");
        return;
      }

      await API.delete(`/${role}/object/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Объект и все его дефекты успешно удалены!");
      navigate(`/${role}/objects`);
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении объекта");
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
              <p className="pageName">Редактирование объекта</p>
            </div>
          </div>

          <div className="profile-body">
            <div className="edit-inputs">
              <input
                type="text"
                name="title"
                placeholder="Название"
                value={object.title}
                onChange={handleChange}
              />
              <textarea
                name="description"
                placeholder="Описание"
                value={object.description}
                onChange={handleChange}
                maxLength={300} // ограничение на 300 символов
              />
              <input
                type="text"
                name="location"
                placeholder="Местоположение"
                value={object.location}
                onChange={handleChange}
              />
              <input
                type="date"
                name="start_date"
                value={object.start_date}
                onChange={handleChange}
              />
              <input
                type="date"
                name="end_date"
                value={object.end_date}
                onChange={handleChange}
              />
              <select
                name="status"
                value={object.status}
                onChange={handleChange}
              >
                <option value="active">Активный</option>
                <option value="completed">Завершён</option>
                <option value="archived">Архив</option>
              </select>
            </div>

            <div className="btns-obj">
                <div>
                    <button
                    className="logout-button"
                    onClick={() => navigate(`/${role}/objects`)}
                    >
                    Отмена
                    </button>
                </div>
                <div>
                    <button
                    className="edit-profile-button"
                    onClick={handleSave}
                    disabled={saving}
                    >
                    {saving ? "Сохранение..." : "Сохранить"}
                    </button>
                </div>
                <div>
                    <button
                    type="button"
                    className="logout-button"
                    onClick={handleDelete}
                    >
                    Удалить объект
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
