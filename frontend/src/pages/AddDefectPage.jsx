import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import "../css/AddObjectPage.css";

export default function AddDefectPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { role, id } = useParams(); // id = object_id из URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      const today = new Date().toISOString().split("T")[0];

      const defectData = {
        title,
        description,
        status: "new",      // автоматически новый статус
        priority: "-",      // автоматически низкий приоритет
        deadline: deadline || today,
      };

      await API.post(`/engineer/object/${id}/defect`, defectData);

      alert("Дефект успешно создан!");
      navigate(`/${role}/object/${id}`);
    } catch (err) {
      console.error("Ошибка при создании дефекта:", err);
      setError("Не удалось создать дефект. Проверьте данные.");
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
              <p className="pageName">Добавить дефект</p>
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
                maxLength={20}
              />
              <textarea
                className="obj-add"
                placeholder="Описание"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={150}
              />
              <input
                className="obj-input"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />

              {error && <p className="error-message">{error}</p>}

              <div className="object-btns">
                <button
                  type="button"
                  className="logout-button"
                  onClick={() => navigate(`/${role}/object/${id}`)}
                >
                  Назад
                </button>
                <button type="submit" className="adding-button" disabled={isLoading}>
                  {isLoading ? "Создание..." : "Создать дефект"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
