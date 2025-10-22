import { useState } from "react";
import "../css/ObjectsPage.css";

export default function AddObjectPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, description, location });
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-card-container">
          <div className="navbar-container">
            <div className="navbar-content">
              <p className="pageName">Добавить объект</p>
            </div>
          </div>

          <div className="profile-body">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Название"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Описание"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="text"
                placeholder="Местоположение"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button type="submit" className="add-button">
                Создать объект
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
