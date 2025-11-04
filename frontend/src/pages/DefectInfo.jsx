import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "../css/DefectPage.css";
import "../css/DefectInfo.css";

export default function DefectInfo() {
  const { role, id: objectId, defectId } = useParams();
  const [defect, setDefect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // роль текущего пользователя

  useEffect(() => {
    const fetchDefect = async () => {
      try {
        if (!token) throw new Error("Нет токена авторизации");

        const response = await API.get(
          `/${role}/object/${objectId}/defect/${defectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDefect(response.data);
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить дефект");
      } finally {
        setLoading(false);
      }
    };

    fetchDefect();
  }, [role, objectId, defectId, token]);

  const handleDelete = async () => {
    if (userRole !== "manager") {
      alert("У Вас нет прав на удаление дефекта.");
      return;
    }

    if (!window.confirm("Вы уверены, что хотите удалить этот дефект?")) return;

    try {
      await API.delete(
        `/${role}/object/${objectId}/defect/${defectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Дефект удалён");
      navigate(`/${role}/object/${objectId}`);
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении дефекта");
    }
  };

  // const handleEdit = () => {
  //   if (userRole !== "engineer" && userRole !== "manager") {
  //     alert("У Вас нет прав на изменение дефекта.");
  //     return;
  //   }
  //   navigate(`/${role}/object/${objectId}/defect/${defectId}/defect-edit`);
  // };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!defect) return <p>Дефект не найден</p>;

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-card-container">
          <div className="navbar-container">
            <div className="navbar-content">
              <p className="pageName">Дефект #{defect.id}</p>
            </div>
          </div>

          <div className="defectInfo-body">
            <div className="defect-details">
              <h2>{defect.title}</h2>
              <p><strong>Статус:</strong> {defect.status}</p>
              <p><strong>Описание:</strong> {defect.description}</p>
              <p><strong>Приоритет:</strong> {defect.priority}</p>
              <p><strong>Дедлайн:</strong> {defect.deadline}</p>
              <p><strong>Создал инженер (ID):</strong> {defect.engineer_id}</p>
            </div>

            <div className="object-btns">
              <button
                className="logout-button"
                onClick={() => navigate(`/${role}/object/${objectId}`)}
              >
                Назад
              </button>
              <button
                className="adding-button"
                onClick={() => {
                  const userRole = localStorage.getItem("role");

                  if (userRole === "manager") {
                    navigate(`/${userRole}/object/${objectId}/defect/${defectId}/defect-edit-manager`);
                  } else if (userRole === "engineer") {
                    navigate(`/${userRole}/object/${objectId}/defect/${defectId}/defect-edit-engineer`);
                  } else {
                    alert("У Вас нет прав на редактирование дефекта.");
                  }
                }}
              >
                Изменить дефект
              </button>


              <button className="logout-button" onClick={handleDelete}>
                Удалить дефект
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
