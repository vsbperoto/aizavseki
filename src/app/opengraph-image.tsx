import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AiZaVseki — AI За Всеки";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0a0a1a 100%)",
          position: "relative",
        }}
      >
        {/* Decorative gradient circles */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #00d4ff, #7c3aed, #ec4899)",
          }}
        />

        {/* Logo sparkle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          </svg>
        </div>

        {/* Brand name */}
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#ffffff",
          }}
        >
          <span>Ai</span>
          <span style={{ color: "#00d4ff" }}>Za</span>
          <span>Vseki</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            marginTop: 16,
            background: "linear-gradient(90deg, #00d4ff, #7c3aed)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          AI ЗА ВСЕКИ
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 24,
            color: "#94a3b8",
            marginTop: 20,
          }}
        >
          Изкуственият интелект, обяснен на човешки език
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 20,
            color: "#00d4ff",
            opacity: 0.8,
            letterSpacing: "0.05em",
          }}
        >
          aizavseki.eu
        </div>
      </div>
    ),
    { ...size }
  );
}
