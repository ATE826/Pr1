import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "../css/ObjectsPage.css";

export default function DefectsPage() {
  const { role, id } = useParams(); // получаем роль и id из URL
  const [object, setObject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchObject = async () => {
      try {
        const response = await API.get(`/${role}/object/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setObject(response.data);
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить объект");
      } finally {
        setLoading(false);
      }
    };

    fetchObject();
  }, [id, role, token]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="object-details-container">
      <div className="navbar-container">
        <div className="navbar-content">
          <p className="pageName">Объект #{id}</p>
          <button className="hrefToPage" onClick={() => navigate(`/${role}/objects`)}>
            Назад
          </button>
        </div>
      </div>

      {object ? (
        <div className="object-details">
          <h2>{object.title}</h2>
          <p><strong>Статус:</strong> {object.status}</p>
          <p><strong>Описание:</strong> {object.description}</p>
          <p><strong>ID:</strong> {object.id}</p>
        </div>
      ) : (
        <p>Объект не найден</p>
      )}
    </div>
  );
}
