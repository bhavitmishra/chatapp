"use client";

import { LogEntry } from "@/hooks/useCodeShare";

const kindStyle: Record<LogEntry["kind"], { color: string; label: string }> = {
  recv: { color: "#2563eb", label: "recv" },
  send: { color: "#16a34a", label: "send" },
  sys:  { color: "#6b7280", label: "sys " },
  err:  { color: "#dc2626", label: "err " },
};

export function LogPanel({ entries, onClear }: { entries: LogEntry[]; onClear: () => void }) {
  return (
    <div
      style={{
        width: 192,
        minWidth: 192,
        borderLeft: "0.5px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        background: "#fafafa",
      }}
    >
      <div
        style={{
          padding: "8px 12px",
          borderBottom: "0.5px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Events
        </span>
        <button
          onClick={onClear}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9ca3af",
            fontSize: 12,
            padding: "2px 4px",
            borderRadius: 4,
          }}
        >
          clear
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
        {entries.length === 0 && (
          <p style={{ fontSize: 11, color: "#d1d5db", textAlign: "center", marginTop: 24 }}>
            no events yet
          </p>
        )}
        {entries.map((e) => {
          const s = kindStyle[e.kind];
          return (
            <div
              key={e.id}
              style={{
                padding: "4px 12px",
                borderBottom: "0.5px solid #f3f4f6",
                fontSize: 11,
                lineHeight: 1.5,
              }}
            >
              <span style={{ fontFamily: "monospace", color: "#9ca3af" }}>{e.ts}</span>{" "}
              <span style={{ color: s.color, fontWeight: 600 }}>{s.label}</span>
              <div style={{ color: "#6b7280", marginTop: 1, wordBreak: "break-all" }}>
                {e.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}