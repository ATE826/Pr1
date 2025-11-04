import { useEffect, useState } from "react";
import API from "../api";
import "../css/ProfilePage.css";
import "../css/DefectPage.css";
import { useNavigate, useParams } from "react-router-dom";

export default function EditDefectByEngineer() {
  const { role, id: objectId, defectId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [defect, setDefect] = useState({
    title: "",
    description: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDefect = async () => {
      try {
        const res = await API.get(`/${role}/object/${objectId}/defect/${defectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDefect({
          title: res.data.title || "",
          description: res.data.description || "",
          status: res.data.status || "new",
        });
      } catch (err) {
        console.error(err);
        alert("Не удалось загрузить дефект");
      } finally {
        setLoading(false);
      }
    };
    fetchDefect();
  }, [role, objectId, defectId, token]);

  const handleChange = (e) => {
    setDefect({ ...defect, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.patch(
        `/${role}/object/${objectId}/defect/${defectId}`,
        defect,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Дефект успешно обновлён");
      navigate(`/${role}/object/${objectId}/defect/${defectId}`);
    } catch (err) {
      console.error(err);
      alert("Ошибка при обновлении дефекта");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-card-container">
          <div className="navbar-container">
            <div className="navbar-content">
              <p className="pageName">Редактирование дефекта</p>
            </div>
          </div>

          <div className="profile-body">
            <div className="edit-inputs">
              <input
                type="text"
                name="title"
                placeholder="Название дефекта"
                value={defect.title}
                onChange={handleChange}
              />
              <textarea
                name="description"
                placeholder="Описание дефекта"
                value={defect.description}
                onChange={handleChange}
              />
              <select name="status" value={defect.status} onChange={handleChange}>
                <option value="new">Новый</option>
                <option value="in_progress">В процессе</option>
                <option value="checking">На проверке</option>
                <option value="canceled">Отменён</option>
                <option value="completed">Завершён</option>
              </select>
            </div>

            <div className="btns-obj">
              <button className="logout-button" onClick={() => navigate(-1)}>
                Отмена
              </button>
              <button className="edit-profile-button" onClick={handleSave} disabled={saving}>
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
