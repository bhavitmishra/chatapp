"use client";

import { ConnStatus } from "../hooks/useCodeShare";

const config: Record<ConnStatus, { label: string; color: string; bg: string; dot: string }> = {
  connected:    { label: "connected",     color: "#166534", bg: "#dcfce7", dot: "#16a34a" },
  connecting:   { label: "connecting…",   color: "#92400e", bg: "#fef3c7", dot: "#d97706" },
  disconnected: { label: "disconnected",  color: "#991b1b", bg: "#fee2e2", dot: "#dc2626" },
};

export function StatusPill({ status }: { status: ConnStatus }) {
  const c = config[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 500,
        background: c.bg,
        color: c.color,
        border: `0.5px solid ${c.dot}44`,
        letterSpacing: "0.02em",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: c.dot,
          animation: status === "connecting" ? "pulse 1.2s infinite" : "none",
        }}
      />
      {c.label}
    </span>
  );
}