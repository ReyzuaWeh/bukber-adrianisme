import { useState } from "react";

interface Props {
  onSave: (username: string) => void;
}

export default function UsernameGate({ onSave }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    localStorage.setItem("username", trimmed);
    onSave(trimmed);
  };
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-xl border border-[#e2e8f0]">
        <h2 className="text-base font-bold text-[#0f172a] mb-1">Apa kodemu?</h2>
        <p className="text-xs text-[#94a3b8] mb-4">Masukkan kode milikmu untuk melanjutkan</p>
        <input
          type="text"
          placeholder="Kode yang dimiliki..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          autoFocus
          className="w-full border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb20] mb-3"
        />
        <button
          onClick={handleSubmit}
          className="w-full py-2.5 bg-[#2563eb] text-white text-sm font-semibold rounded-xl hover:bg-[#1d4ed8] transition-all"
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
}