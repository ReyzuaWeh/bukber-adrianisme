import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner() {
  const [result, setResult] = useState("");
  const [active, setActive] = useState(false);
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const start = async (facingMode: "environment" | "user" = facing) => {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;
    await scanner.start(
      { facingMode },
      { fps: 10, qrbox: { width: 220, height: 220 } },
      (text) => { setResult(text); stop(); },
      () => {}
    );
    setActive(true);
  };

  const toggleCamera = async () => {
    const next = facing === "environment" ? "user" : "environment";
    setFacing(next);
    if (active) { await stop(); setTimeout(() => start(next), 300); }
  };

  const stop = async () => {
    if (scannerRef.current?.isScanning) await scannerRef.current.stop();
    setActive(false);
  };

  useEffect(() => () => { stop(); }, []);

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center font-mono p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg shadow-[#3b82f620] border border-[#e2e8f0] overflow-hidden">

        {/* Header */}
        <div className="bg-[#2563eb] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white opacity-80" />
            <span className="text-white text-xs tracking-[0.25em] uppercase font-semibold">QR Scanner</span>
          </div>
          <button
            onClick={toggleCamera}
            className="text-white/70 text-xs tracking-widest uppercase hover:text-white transition-all border border-white/20 hover:border-white/50 px-2.5 py-1 rounded"
          >
            {facing === "environment" ? "↺ Front" : "↺ Back"}
          </button>
        </div>

        <div className="p-5">
          {/* Viewport */}
          <div className="relative bg-[#f8fafc] aspect-square overflow-hidden mb-4 rounded-xl border border-[#e2e8f0]">
            <div id="qr-reader" className="w-full h-full" />
            {!active && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="grid grid-cols-3 gap-1 opacity-20">
                  {[1,1,1,1,0,1,1,1,1].map((v, i) => (
                    <div key={i} className={`w-5 h-5 rounded-sm ${v ? "bg-[#2563eb]" : ""}`} />
                  ))}
                </div>
                <span className="text-[#94a3b8] text-[10px] tracking-widest uppercase">Standby</span>
              </div>
            )}
            {/* Corner accents */}
            <span className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#2563eb] rounded-tl" />
            <span className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#2563eb] rounded-tr" />
            <span className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#2563eb] rounded-bl" />
            <span className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#2563eb] rounded-br" />
          </div>

          {/* Result */}
          {result && (
            <div className="mb-4 p-3 bg-[#eff6ff] border border-[#bfdbfe] rounded-xl text-sm text-[#1e40af] break-all">
              {result}
              {(() => { try { new URL(result); return (
                <a href={result} target="_blank" rel="noopener noreferrer"
                  className="block mt-2 text-[10px] text-[#2563eb] tracking-widest hover:underline uppercase font-semibold">
                  Open ↗
                </a>
              ); } catch { return null; } })()}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={active ? stop : () => start()}
              className={`flex-1 py-2.5 text-xs tracking-[0.2em] uppercase font-semibold transition-all rounded-lg border ${
                active
                  ? "bg-white border-[#fca5a5] text-[#ef4444] hover:bg-[#fef2f2]"
                  : "bg-[#2563eb] border-[#2563eb] text-white hover:bg-[#1d4ed8]"
              }`}
            >
              {active ? "Stop" : result ? "Scan Again" : "Start Scan"}
            </button>
            {result && (
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="px-4 py-2.5 border border-[#e2e8f0] text-[#64748b] text-xs tracking-widest uppercase rounded-lg hover:bg-[#f8fafc] hover:text-[#334155] transition-all"
              >
                Copy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}