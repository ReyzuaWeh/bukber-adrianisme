import { useEffect, useRef, useState } from "react";
import { WS_URL as ws } from "../environment.ts";

type WsStatus = "connecting" | "connected" | "disconnected";

const WS_URL = `${ws}/ws/qrcode`;

const wsColors: Record<WsStatus, string> = {
  connecting:   "bg-[#fbbf24]",
  connected:    "bg-[#22c55e]",
  disconnected: "bg-[#ef4444]",
};
const wsLabels: Record<WsStatus, string> = {
  connecting:   "Menghubungkan...",
  connected:    "Terhubung",
  disconnected: "Terputus — Menghubungkan ulang",
};

export default function QRCode() {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [wsStatus, setWsStatus] = useState<WsStatus>("disconnected");
  const wsRef = useRef<WebSocket | null>(null);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   @ts-ignore
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();
  const qrImageRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;
		if (!isMounted) return;
    const connect = () => {
      setWsStatus("connecting");
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => { if (isMounted) setWsStatus("connected"); };

      ws.onmessage = (event) => {
        if (!isMounted) return;
        const blob = new Blob([event.data], { type: "image/png" });
        const url = URL.createObjectURL(blob);
        // Revoke previous URL
        if (qrImageRef.current) URL.revokeObjectURL(qrImageRef.current);
        qrImageRef.current = url;
        setQrImage(url);
      };

      ws.onclose = () => {
        if (!isMounted) return;
        setWsStatus("disconnected");
        reconnectTimer.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => ws.close();
    };

    connect();

    return () => {
      isMounted = false;
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
      if (qrImageRef.current) URL.revokeObjectURL(qrImageRef.current);
    };
  }, []);

  const manualReconnect = () => {
    clearTimeout(reconnectTimer.current);
    wsRef.current?.close();
  };

  return (
		<>
    <div className="max-w-md mx-auto px-4 pt-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">QR Code Absensi</h1>
          <p className="text-sm text-[#64748b] mt-0.5">Refresh otomatis via WebSocket</p>
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-[#e2e8f0] rounded-xl px-3 py-1.5">
          <div className={`w-2 h-2 rounded-full ${wsColors[wsStatus]} ${wsStatus === "connected" ? "animate-pulse" : ""}`} />
          <span className="text-[10px] text-[#64748b] font-medium">
            {wsStatus === "connected" ? "Live" : wsStatus === "connecting" ? "..." : "Off"}
          </span>
        </div>
      </div>

      {/* QR Code card */}
      <div className="bg-white rounded-3xl border border-[#e2e8f0] p-6 flex flex-col items-center shadow-sm mb-4">
        {qrImage ? (
          <img src={qrImage} alt="QR Code" className="w-56 h-56 rounded-xl" />
        ) : (
          <div className="w-56 h-56 rounded-xl bg-[#f1f5f9] flex flex-col items-center justify-center gap-3 animate-pulse">
            <div className="grid grid-cols-3 gap-2 opacity-30">
              {[1,1,1,1,0,1,1,1,1].map((v, i) => (
                <div key={i} className={`w-8 h-8 rounded ${v ? "bg-[#2563eb]" : ""}`} />
              ))}
            </div>
            <span className="text-xs text-[#94a3b8]">
              {wsStatus === "connecting" ? "Menghubungkan..." : "Menunggu QR..."}
            </span>
          </div>
        )}
      </div>

      {/* WS status */}
      <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl border ${
        wsStatus === "connected"    ? "bg-[#f0fdf4] border-[#bbf7d0]" :
        wsStatus === "connecting"   ? "bg-[#fffbeb] border-[#fde68a]" :
                                      "bg-[#fef2f2] border-[#fecaca]"
      }`}>
        <div className={`w-2 h-2 rounded-full shrink-0 ${wsColors[wsStatus]}`} />
        <span className="text-xs text-[#475569]">{wsLabels[wsStatus]}</span>
        {wsStatus === "disconnected" && (
          <button onClick={manualReconnect} className="ml-auto text-xs text-[#2563eb] font-semibold hover:underline">
            Hubungkan
          </button>
        )}
      </div>

      <p className="text-center text-xs text-[#94a3b8] mt-4 px-4">
        QR diperbarui otomatis setiap 30 detik
      </p>
    </div>
		</>
  );
}