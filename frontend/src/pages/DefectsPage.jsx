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

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-card-container">
          <div className="navbar-container">
            <div className="navbar-content">
              <p className="pageName">Объект #{object?.ID}</p>
            </div>
          </div>

          <div className="defect-body">
            {/* Информация об объекте */}
            <div className="defect-details">
              <h2>{object?.title}</h2>
              <p><strong>Статус:</strong> {object?.status}</p>
              <p><strong>Описание:</strong> {object?.description}</p>
              <p><strong>Местоположение:</strong> {object?.location}</p>
              <p><strong>Начало:</strong> {object?.start_date}</p>
              <p><strong>Окончание:</strong> {object?.end_date}</p>
              <p><strong>Количество дефектов:</strong> {object?.count_of_defects}</p>
            </div>

            {/* Дефекты */}
            <div>
              <h3>Дефекты</h3>
              <div className="objects-table">
                {defects.length === 0 ? (
                  <p>Дефектов пока нет</p>
                ) : (
                  <div className="objects-list">
                    {defects.map((defect) => (
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
                  <button type="submit" className="adding-button" onClick={() => {
                    const role = localStorage.getItem("role");
                    if (role !== "manager") {
                      alert("У Вас нет прав на выпонение этого действия.");
                      return;
                    }
                    navigate(`/${role}/object/${id}/edit-object`);
                  }}>
                    Изменить
                  </button>
                </div>
                <div>
                  <button type="submit" className="adding-button" onClick={() => {
                    const role = localStorage.getItem("role");
                    if (role !== "engineer") {
                      alert("У Вас нет прав на выпонение этого действия.");
                      return;
                    }
                    navigate(`/${role}/object/${id}/add-defect`);
                  }}>
                    Добавить дефект
                  </button>
                </div>
              </div>
        </div>
        
      </div>
    </div>
  );
}
