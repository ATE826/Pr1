import { useNavigate } from "react-router-dom";
import '../css/HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <button className="logout-button" onClick={handleLogout}>Выйти</button>
      </div>
    </div>
  );
}
