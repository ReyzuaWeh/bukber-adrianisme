import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Scanner from "./pages/Scanner.tsx";
import Roulette from "./pages/Roulette.tsx";
import QRCode from "./pages/QRCode.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/roulette" element={<Roulette />} />
          <Route path="/qrcode" element={<QRCode />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}