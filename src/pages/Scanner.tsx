import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { BACKEND_URL } from "../environment";
import SetUsername from "../components/SetUsername";

type ScanState = "idle" | "scanning" | "process" | "success" | "error";

export default function Scanner() {
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [username, setUsername] = useState<string|null>(localStorage.getItem('username'));
  const [state, setState] = useState<ScanState>("idle");
  const [result, setResult] = useState("");
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const [active, setActive] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  // Ambil koordinat sekali saat mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCoords({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    });
  }, []);

  const stop = async () => {
    if (scannerRef.current?.isScanning) await scannerRef.current.stop();
    setActive(false);
  };

  const start = async (facingMode: "environment" | "user" = facing) => {
    const scanner = new Html5Qrcode("qr-viewport");
    scannerRef.current = scanner;
    setState("scanning");
    await scanner.start(
      { facingMode },
      { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1  },
      (text) => {
        (async () => {
          await stop();
          setState("process");
          const username = localStorage.getItem("username");
          try {
            const response = await fetch(`${BACKEND_URL}/present`, {
              method: "PUT",
              headers: {
                "Authorization": `Bearer ${text}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ kode_member: username, user_lat: coords?.lat, user_lon: coords?.lon }),
            });
            if (!response.ok) {
              const data = await response.json();
              setResult(`Gagal: ${data.detail}`);
              setState("error");
              return;
            }
            setResult("Berhasil terdata!");
            setState("success");
          } catch (e) {
            console.error(e);
            setResult("Gagal terhubung ke server");
            setState("error");
          }
        })();
      },
      () => {}
    );
    setActive(true);
  };

  const toggleCamera = async () => {
    const next = facing === "environment" ? "user" : "environment";
    setFacing(next);
    if (active) { await stop(); setTimeout(() => start(next), 300); }
  };

  const reset = () => { setState("idle"); setResult(""); };

  useEffect(() => { 
    if(!username) return
    return () => { 
      stop(); 
    }; 
  }, [username]);

  return (
    <>
    <div className="fixed inset-0 bg-[#0f172a] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {!username && <SetUsername onSave={setUsername} onClose={undefined} />}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400&display=swap" rel="stylesheet" />

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4 z-10">
        <button
          onClick={() => { stop(); navigate("/dashboard"); }}
          className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-white font-semibold text-sm">Scan QR Kehadiran</span>
        <button
          onClick={toggleCamera}
          className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Camera area */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="relative w-full max-w-xs aspect-square">
          <div className="w-full h-full rounded-3xl overflow-hidden bg-black">
            <div id="qr-viewport" className="w-full h-full" />
            {!active && state !== "process" && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0f172a]">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-white/30 text-xs">Kamera belum aktif</p>
                </div>
              </div>
            )}
          </div>

          {/* Corner frame */}
          {["top-0 left-0 border-t-2 border-l-2 rounded-tl-3xl",
            "top-0 right-0 border-t-2 border-r-2 rounded-tr-3xl",
            "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-3xl",
            "bottom-0 right-0 border-b-2 border-r-2 rounded-br-3xl"].map((cls, i) => (
            <div key={i} className={`absolute w-8 h-8 border-[#3b82f6] ${cls}`} />
          ))}

          {/* Process overlay */}
          {state === "process" && (
            <div className="absolute inset-0 rounded-3xl bg-black/80 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span className="text-white/70 text-xs">Memproses...</span>
            </div>
          )}

          {/* Success overlay */}
          {state === "success" && (
            <div className="absolute inset-0 rounded-3xl bg-[#16a34a]/90 flex flex-col items-center justify-center gap-2">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white font-semibold text-sm">Berhasil!</span>
            </div>
          )}

          {/* Error overlay */}
          {state === "error" && (
            <div className="absolute inset-0 rounded-3xl bg-[#dc2626]/90 flex flex-col items-center justify-center gap-2">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span className="text-white font-semibold text-sm">Gagal</span>
            </div>
          )}
        </div>
      </div>

      {/* Result card */}
      {result && (
        <div className={`mx-5 mb-4 p-4 rounded-2xl border ${
          state === "success" ? "bg-[#16a34a]/20 border-[#16a34a]/30" : "bg-[#dc2626]/20 border-[#dc2626]/30"
        }`}>
          <div className="text-[10px] text-white/40 tracking-widest uppercase mb-1">
            {state === "success" ? "Sukses" : "Error"}
          </div>
          <div className="text-white text-sm break-all font-mono">{result}</div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="px-5 pb-10 flex gap-3">
        {state === "process" ? (
          <div className="flex-1 py-3.5 bg-white/5 rounded-2xl text-white/40 text-sm font-semibold text-center">
            Memproses...
          </div>
        ) : state === "success" || state === "error" ? (
          <button
            onClick={reset}
            className="flex-1 py-3.5 bg-[#2563eb] rounded-2xl text-white text-sm font-semibold hover:bg-[#1d4ed8] transition-all"
          >
            Scan Lagi
          </button>
        ) : active ? (
          <button
            onClick={stop}
            className="flex-1 py-3.5 bg-white/10 rounded-2xl text-white text-sm font-semibold hover:bg-white/20 transition-all"
          >
            Berhenti
          </button>
        ) : (
          <button
            onClick={() => start()}
            className="flex-1 py-3.5 bg-[#2563eb] rounded-2xl text-white text-sm font-semibold hover:bg-[#1d4ed8] active:scale-[0.98] transition-all shadow-lg shadow-[#2563eb40]"
          >
            Mulai Scan
          </button>
        )}
      </div>
    </div>
    </>
  );
}