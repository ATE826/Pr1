import { useEffect, useState } from "react";
import API from "../api";
import "../css/ProfilePage.css";
import { useNavigate, Link } from "react-router-dom";

export default function ObjectsPage() {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const role = localStorage.getItem("role"); // роль пользователя
  const token = localStorage.getItem("token"); // токен

  const goToProfile = () => {
    if (!token || !role) {
      navigate("/login");
    } else {
      navigate(`/${role}/profile`);
    }
  };

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
            {objects.length === 0 ? (
              <p>Объектов пока нет</p>
            ) : (
              <div className="objects-list">
                {objects.map((obj) => (
                  <div key={obj.id} className="object-card">
                    <h3>{obj.name}</h3>
                    <p>{obj.description}</p>
                    <Link to={`/${role}/object/${obj.id}`}>
                      Перейти к объекту
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
