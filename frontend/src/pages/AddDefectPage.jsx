import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import "../css/AddObjectPage.css";

export default function AddDefectPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("new");
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
        priority,
        status,
        deadline: deadline || today,
      };

      // ⚡ Правильный путь (совпадает с бэком)
      await API.post(`/engineer/object/${id}/defect`, defectData);

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
              <select
                className="obj-input"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Низкий приоритет</option>
                <option value="medium">Средний приоритет</option>
                <option value="high">Высокий приоритет</option>
              </select>
              <input
                className="obj-input"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                
              />
              <select
                className="obj-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="new">Новый</option>
                <option value="in_progress">В работе</option>
                <option value="checking">Проверка</option>
                <option value="canceled">Отменён</option>
                <option value="completed">Завершён</option>
              </select>

              {error && <p className="error-message">{error}</p>}

              <div className="object-btns">
                <div>
                  <button
                    type="button"
                    className="logout-button"
                    onClick={() => navigate(`/${role}/object/${id}`)}
                  >
                    Назад
                  </button>
                </div>
                <div>
                  <button type="submit" className="adding-button" disabled={isLoading}>
                    {isLoading ? "Создание..." : "Создать дефект"}
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
