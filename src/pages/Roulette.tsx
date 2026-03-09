import { useEffect, useState } from "react";
import { BACKEND_URL } from "../environment";
import type { Member } from "../types/Member";

export default function Roulette() {
  const [spinning, setSpinning] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const spin = async () => {
    if (spinning) return;
    setWinner(null);
    setSpinning(true);
    const extraSpins = 5 * 360;
    const randomAngle = Math.random() * 360;
    const newRotation = rotation + extraSpins + randomAngle;
    setRotation(newRotation);

    setTimeout(() => {
      const mockWinner = members[Math.floor(Math.random() * members.length)];
      setWinner(mockWinner.kode);
      setSpinning(false);
    }, 3000);
  };

  const segmentAngle = 360 / members.length;
  const colors = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];
  useEffect(() => {
    fetch(`${BACKEND_URL}/members?only_present=true`)
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch(console.error);
  }, []);
  return (
    <div className="max-w-md mx-auto px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#0f172a]">Undian Gacha</h1>
        <p className="text-sm text-[#64748b] mt-0.5">Spin roda untuk memilih peserta secara acak</p>
      </div>

      {/* Wheel */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          {/* Pointer */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <div className="w-0 h-0 border-l-10 border-r-10 border-t-20 border-l-transparent border-r-transparent border-t-[#0f172a]" />
          </div>

          {/* Wheel SVG */}
          <div
            className="w-64 h-64 rounded-full border-4 border-white shadow-2xl shadow-[#2563eb20] overflow-hidden"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {members.map((member, i) => {
                const startAngle = (i * segmentAngle - 90) * (Math.PI / 180);
                const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180);
                const x1 = 100 + 100 * Math.cos(startAngle);
                const y1 = 100 + 100 * Math.sin(startAngle);
                const x2 = 100 + 100 * Math.cos(endAngle);
                const y2 = 100 + 100 * Math.sin(endAngle);
                const midAngle = ((i + 0.5) * segmentAngle - 90) * (Math.PI / 180);
                const tx = 100 + 65 * Math.cos(midAngle);
                const ty = 100 + 65 * Math.sin(midAngle);
                return (
                  <g key={i}>
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
                      fill={colors[i % colors.length]}
                      stroke="white"
                      strokeWidth="1.5"
                    />
                    <text
                      x={tx} y={ty}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="7"
                      fontWeight="600"
                      transform={`rotate(${(i + 0.5) * segmentAngle}, ${tx}, ${ty})`}
                    >
                      {member.nama.split(" ")[0]}
                    </text>
                  </g>
                );
              })}
              <circle cx="100" cy="100" r="12" fill="white" />
              <circle cx="100" cy="100" r="8" fill="#0f172a" />
            </svg>
          </div>
        </div>
      </div>

      {/* Winner banner */}
      {winner && (
        <div className="mb-5 p-4 bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl text-center">
          <div className="text-xs text-[#2563eb] font-semibold uppercase tracking-widest mb-1">Yang Terpilih</div>
          <div className="text-xl font-bold text-[#0f172a]">{members.find((member)=>member.kode === winner)?.nama}</div>
        </div>
      )}

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={spinning || members.length === 0}
        className={`w-full py-4 rounded-2xl text-sm font-bold tracking-wide transition-all ${
          spinning
            ? "bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed"
            : "bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-lg shadow-[#2563eb30] active:scale-[0.98]"
        }`}
      >
        {spinning ? "Spinning..." : members.length === 0 ? "Belum bisa putar" : "PUTAR RODA"}
      </button>

      {/* Participants */}
      <div className="mt-6">
        <div className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-3">Peserta yang hadir · {members.length}</div>
        <div className="grid grid-cols-2 gap-2">
          {members.map((member, i) => (
            <div key={i} className="bg-white rounded-xl px-3 py-2.5 flex items-center gap-2 border border-[#e2e8f0]">
              <div className="w-2 h-2 rounded-full" style={{ background: colors[i % colors.length] }} />
              <span className="text-sm text-[#334155] truncate">{member.nama}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}