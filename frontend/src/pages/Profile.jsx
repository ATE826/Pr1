import { useEffect, useState } from "react";
import API from "../api";

export default function EngineerProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Нет токена авторизации");

        const response = await API.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.data || Object.keys(response.data).length === 0) {
          setError("Пользователь не найден");
          setUser(null);
        } else {
          setUser(response.data);
        }
      } catch (err) {
        console.error(err);
        setError("Ошибка при получении данных пользователя");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Профиль {user.role}а</h1>
      <p>Имя: {user.first_name}</p>
      <p>Фамилия: {user.last_name}</p>
      <p>Отчество: {user.patronymic}</p>
      <p>Email: {user.email}</p>
      <p>Роль: {user.role}</p>
    </div>
  );
}
