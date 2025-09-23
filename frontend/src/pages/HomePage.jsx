import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-xl text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">
          ООО «СистемаКонтроля»
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Добро пожаловать в систему управления строительными объектами!
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:bg-red-700 transition"
        >
          Выйти
        </button>
      </div>
    </div>
  );
}
