import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import  ProfilePage  from "./pages/ProfilePage";
import LoginPage  from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}


export default App;


//         <Route path="/register" element={<RegisterPage />} />