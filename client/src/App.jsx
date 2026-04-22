import { Routes, Route, Navigate } from "react-router-dom";
import GatePage from "./pages/GatePage.jsx";
import NamePage from "./pages/NamePage.jsx";
import LevelsPage from "./pages/LevelsPage.jsx";
import ProblemListPage from "./pages/ProblemListPage.jsx";
import ProblemPage from "./pages/ProblemPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GatePage />} />
      <Route path="/name" element={<NamePage />} />
      <Route path="/levels" element={<LevelsPage />} />
      <Route path="/levels/:level" element={<ProblemListPage />} />
      <Route path="/levels/:level/:problemId" element={<ProblemPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
