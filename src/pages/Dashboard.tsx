import {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../environment";
import type { Member } from "../types/Member";

// Mock data — replace with API calls
const statusConfig = {
  hadir:     { label: "Hadir",     bg: "bg-[#dcfce7]", text: "text-[#16a34a]", dot: "bg-[#22c55e]" },
  absen:     { label: "Absen",     bg: "bg-[#fee2e2]", text: "text-[#dc2626]", dot: "bg-[#ef4444]" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [filter, setFilter] = useState<"semua" | "hadir" | "terlambat" | "absen">("semua");

  const counts = {
    hadir: members.filter((a) => a.hadir).length,
    absen: members.filter((a) => !a.hadir).length,
  };
  useEffect(() => {
    fetch(`${BACKEND_URL}/members`)
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch(console.error);
  }, []);
  return (
    <div className="max-w-md mx-auto px-4 pt-5 pb-4">
      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {(["hadir", "absen"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(filter === s ? "semua" : s)}
            className={`rounded-2xl p-3.5 text-left transition-all border ${
              filter === s
                ? "bg-[#2563eb] border-[#2563eb] shadow-lg shadow-[#2563eb30]"
                : "bg-white border-[#e2e8f0] hover:border-[#bfdbfe]"
            }`}
          >
            <div className={`text-2xl font-bold ${filter === s ? "text-white" : "text-[#0f172a]"}`}>
              {counts[s]}
            </div>
            <div className={`text-[10px] font-medium capitalize mt-0.5 ${filter === s ? "text-blue-100" : "text-[#94a3b8]"}`}>
              {statusConfig[s].label}
            </div>
          </button>
        ))}
      </div>
      {/* Attendance list */}
      <div className="space-y-2">
        {members.map((person, i) => {
          const cfg = statusConfig[person.hadir ? "hadir" :"absen"];
          return (
            <div
              key={i+1}
              className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3.5 border border-[#e2e8f0] hover:border-[#bfdbfe] hover:shadow-sm transition-all"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-xl bg-[#eff6ff] flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-[#2563eb]">{person.nama[0]}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#0f172a] truncate">{person.nama}</div>
              </div>

              {/* Time & status */}
              <div className="text-right shrink-0">
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB Scan button */}
      <button
        onClick={() => navigate("/scanner")}
        className="fixed bottom-20 right-5 w-14 h-14 bg-[#2563eb] rounded-2xl flex items-center justify-center shadow-xl shadow-[#2563eb40] hover:bg-[#1d4ed8] hover:scale-105 active:scale-95 transition-all z-20"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      </button>
    </div>
  );
}