import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../layout/AppShell";
import { DetailsPage } from "../../pages/DetailsPage";
import { HistoryPage } from "../../pages/HistoryPage";
import { HomePage } from "../../pages/HomePage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="traceroute/:id" element={<DetailsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
