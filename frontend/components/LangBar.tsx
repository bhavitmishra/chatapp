"use client";

export const LANGS = ["javascript", "typescript", "python", "go", "rust", "sql", "bash"] as const;
export type Lang = (typeof LANGS)[number];

export function LangBar({ active, onChange }: { active: Lang; onChange: (l: Lang) => void }) {
  return (
    <div
      style={{
        display: "flex",
        borderBottom: "0.5px solid #e5e7eb",
        background: "#fafafa",
        overflowX: "auto",
      }}
    >
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          style={{
            padding: "7px 14px",
            fontSize: 12,
            border: "none",
            borderBottom: l === active ? "1.5px solid #2563eb" : "1.5px solid transparent",
            background: "none",
            color: l === active ? "#2563eb" : "#9ca3af",
            cursor: "pointer",
            fontWeight: l === active ? 500 : 400,
            whiteSpace: "nowrap",
            transition: "color 0.1s",
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}