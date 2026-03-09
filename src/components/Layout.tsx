import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import SetUsername from "./SetUsername";

const navItems = [
  {
    to: "/dashboard",
    label: "Kehadiran",
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    to: "/roulette",
    label: "Undian",
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    to: "/qrcode",
    label: "QR Code",
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
    ),
  },
];

export default function Layout() {
  const location = useLocation();
  const [formUsername, setFormUsername] = useState<boolean>(false);
  const isScanner = location.pathname === "/scanner";
  const setForm = ()=>setFormUsername(!formUsername)

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {formUsername && <SetUsername onSave={undefined} onClose={setForm}/>}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Top bar */}
      {!isScanner && (
        <header className="bg-white border-b border-[#e2e8f0] px-5 py-3.5 flex items-center justify-between sticky top-0 z-10 shadow-sm shadow-[#2563eb08]">
          <div className="flex items-center gap-2.5">
            <button onClick={setForm} className="w-7 h-7 bg-[#2563eb] rounded-lg flex items-center ease-in duration-75 hover:cursor-pointer justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <span className="text-[#0f172a] font-semibold text-sm tracking-tight">Attandnisme</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-xs text-[#64748b]">Live</span>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      {!isScanner && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e2e8f0] px-4 pb-safe shadow-[0_-4px_20px_rgba(37,99,235,0.06)]">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {navItems.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-3 px-5 transition-all ${
                    isActive ? "text-[#2563eb]" : "text-[#94a3b8] hover:text-[#64748b]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`transition-all ${isActive ? "scale-110" : ""}`}>
                      {icon(isActive)}
                    </div>
                    <span className={`text-[10px] font-medium tracking-wide ${isActive ? "text-[#2563eb]" : ""}`}>
                      {label}
                    </span>
                    {isActive && <div className="w-1 h-1 rounded-full bg-[#2563eb] -mt-0.5" />}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}