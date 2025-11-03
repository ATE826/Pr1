import { useState } from "react";
import "../css/ObjectsPage.css";
import "../css/AddObjectPage.css";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

export default function AddObjectPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState(""); // строки в формате YYYY-MM-DD
  const [endDate, setEndDate] = useState("");     // строки в формате YYYY-MM-DD
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { role } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      // если даты пустые, подставляем сегодняшнюю
      const today = new Date().toISOString().split("T")[0];

      const form = {
        title: title,
        description: description,
        location: location,
        start_date: startDate || today, // строго YYYY-MM-DD
        end_date: endDate || today,     // строго YYYY-MM-DD
        status: "active",               // активный по умолчанию
      };

      await API.post("/manager/object", form);
      navigate(`/${role}/objects`);
    } catch (err) {
      console.error("Ошибка при создании объекта:", err);
      setError("Не удалось создать объект. Проверьте даты.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-card-container">
          <div className="navbar-container">
            <div className="navbar-content">
              <p className="pageName">Добавить объект</p>
            </div>
          </div>

          <div className="profile-body">
            <form onSubmit={handleSubmit} className="object-adding">
              <input
                className="obj-input"
                type="text"
                placeholder="Название"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                className="obj-add"
                placeholder="Описание"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                className="obj-input"
                type="text"
                placeholder="Местоположение"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <input
                className="obj-input"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <input
                className="obj-input"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />

              {error && <p className="error-message">{error}</p>}

              <div className="object-btns">
                <div>
                  <button
                    type="button"
                    className="logout-button"
                    onClick={() => navigate(`/${role}/objects`)}
                  >
                    Назад
                  </button>
                </div>
                <div>
                  <button type="submit" className="adding-button" disabled={isLoading}>
                    {isLoading ? "Создание..." : "Создать объект"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
