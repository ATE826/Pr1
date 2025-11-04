import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "../css/ObjectsPage.css";
import "../css/ProfilePage.css";
import "../css/DefectPage.css";

export default function ObjectPage() {
  const { role, id } = useParams();
  const [object, setObject] = useState(null);
  const [defects, setDefects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(""); // поиск по названию
  const [statusFilter, setStatusFilter] = useState(""); // фильтр по статусу
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token || !role) throw new Error("Нет токена или роли");

        // Получаем объект
        const objRes = await API.get(`/${role}/object/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setObject(objRes.data);

        // Получаем дефекты
        const defectsRes = await API.get(`/${role}/object/${id}/defects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDefects(Array.isArray(defectsRes.data) ? defectsRes.data : []);
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, role, token]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  // Фильтрация и поиск дефектов
  const filteredDefects = defects.filter((defect) => {
    const matchesSearch = defect.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? defect.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-card-container">
          <div className="navbar-container">
            <div className="navbar-content">
              <p className="pageName">Объект #{object?.ID}</p>
            </div>
          </div>

          {/* Поиск и фильтр */}
          <div className="search-sort-container">
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="sort-select"
            >
              <option value="">Все статусы</option>
              <option value="new">Новый</option>
              <option value="in_progress">В процессе</option>
              <option value="checking">На проверке</option>
              <option value="canceled">Отменён</option>
              <option value="completed">Завершён</option>
            </select>
          </div>

          {/* Информация об объекте */}
          <div className="defect-body">
            <div className="defect-details">
              <h2>{object?.title}</h2>
              <p><strong>Статус:</strong> {object?.status}</p>
              <p><strong>Описание:</strong> {object?.description}</p>
              <p><strong>Местоположение:</strong> {object?.location}</p>
              <p><strong>Начало:</strong> {object?.start_date}</p>
              <p><strong>Окончание:</strong> {object?.end_date}</p>
              <p><strong>Количество дефектов:</strong> {object?.count_of_defects}</p>
            </div>

            {/* Список дефектов */}
            <div>
              <h3>Дефекты</h3>
              <div className="objects-table">
                {filteredDefects.length === 0 ? (
                  <p>Дефектов не найдено</p>
                ) : (
                  <div className="objects-list">
                    {filteredDefects.map((defect) => (
                      <div
                        key={defect.ID || defect.id}
                        className="object-card"
                        onClick={() =>
                          navigate(`/${role}/object/${id}/defect/${defect.ID || defect.id}`)
                        }
                      >
                        <div>
                          <h3>{defect.title}</h3>
                          <h4 className="title">{defect.status}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="object-btns">
            <button
              type="button"
              className="logout-button"
              onClick={() => navigate(`/${role}/objects`)}
            >
              Назад
            </button>
            <button
              type="submit"
              className="adding-button"
              onClick={() => {
                const userRole = localStorage.getItem("role");
                if (userRole !== "manager") {
                  alert("У Вас нет прав на выполнение этого действия.");
                  return;
                }
                navigate(`/${userRole}/object/${id}/edit-object`);
              }}
            >
              Изменить объект
            </button>
            <button
              type="submit"
              className="adding-button"
              onClick={() => {
                const userRole = localStorage.getItem("role");
                if (userRole !== "engineer") {
                  alert("У Вас нет прав на выполнение этого действия.");
                  return;
                }
                navigate(`/${userRole}/object/${id}/add-defect`);
              }}
            >
              Добавить дефект
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
