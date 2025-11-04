import { useEffect, useState } from "react";
import API from "../api";
import "../css/ProfilePage.css";
import "../css/ObjectsPage.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


export default function ObjectsPage() {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const role = localStorage.getItem("role"); 
  const token = localStorage.getItem("token");

  // Подгрузка объектов
  useEffect(() => {
    const fetchObjects = async () => {
      try {
        if (!token || !role) throw new Error("Нет токена или роли");

        const response = await API.get(`/${role}/objects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setObjects(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(err);
        setError("Объектов пока нет");
        setObjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, [token, role]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-card-container">
          <div className="navbar-container">
            <div className="navbar-content">
              <p className="pageName">Объекты</p>
              <Link className="hrefToPage" to={`/${role}/profile`}>Профиль</Link>
            </div>
          </div>

          <div className="profile-body">
            <div className="objects-table">
              {objects.length === 0 ? (
                <p>Объектов пока нет</p>
              ) : (
                <div className="objects-list">
                  {objects.map((obj) => (
                    <div
                      key={obj.id}
                      className="object-card"
                      onClick={() => navigate(`/${role}/object/${obj.ID}`)}
                    >
                      <div>
                        <h3>{obj.title}</h3>
                        <h4 className="title">{obj.status}</h4>

                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="button">
              <button
                className="add-button"
                onClick={() => {
                  const role = localStorage.getItem("role");
                  if (role !== "manager") {
                    alert("У Вас нет прав на выпонение этого действия.");
                    return;
                  }
                  // Если роль manager — переход на страницу добавления объекта
                  navigate(`/${role}/object/add-object`);
                }}
              >
                Добавить объект
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
