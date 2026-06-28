"use client";

import { useState, useCallback } from "react";
import { useCodeShare } from "../hooks/useCodeShare";
import { StatusPill } from "../components/StatusPill";
import { LogPanel } from "../components/LogPanel";
import { LangBar, Lang, LANGS } from "../components/LangBar";

const WS_URL = "wss://chatapp-qj2o.onrender.com";

function btnStyle(bg: string, color: string, disabled = false): React.CSSProperties {
  return {
    padding: "5px 14px",
    fontSize: 12,
    fontWeight: 500,
    borderRadius: 6,
    border: "0.5px solid #e5e7eb",
    background: disabled ? "#f3f4f6" : bg,
    color: disabled ? "#9ca3af" : color,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    transition: "opacity 0.1s",
  };
}

const kbdStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "1px 5px",
  fontSize: 10,
  border: "0.5px solid #d1d5db",
  borderRadius: 3,
  background: "#f3f4f6",
  color: "#6b7280",
  fontFamily: "monospace",
};

export default function Page() {
  const { status, code, setCode, log, send, connect, disconnect } = useCodeShare(WS_URL);
  const [lang, setLang] = useState<Lang>(LANGS[0]);
  const [clearedAt, setClearedAt] = useState(0);

  const visibleLog = log.filter((e) => e.id >= clearedAt);

  const handleSend = useCallback(() => {
    if (!code.trim()) return;
    send(code);
  }, [code, send]);

  const handleCopy = useCallback(() => {
    if (!code) return;
    navigator.clipboard.writeText(code);
  }, [code]);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 20px",
            background: "#fff",
            borderBottom: "0.5px solid #e5e7eb",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111827", letterSpacing: "-0.01em" }}>
            CodeShare
          </span>
          <code
            style={{
              fontSize: 12,
              color: "#9ca3af",
              background: "#f3f4f6",
              padding: "2px 7px",
              borderRadius: 4,
            }}
          >
            {WS_URL}
          </code>
          <StatusPill status={status} />

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {status === "disconnected" ? (
              <button onClick={connect} style={btnStyle("#2563eb", "#fff")}>
                reconnect
              </button>
            ) : (
              <button onClick={disconnect} style={btnStyle("#f9fafb", "#6b7280")}>
                disconnect
              </button>
            )}
            <button onClick={handleCopy} style={btnStyle("#f9fafb", "#374151", !code)}>
              copy
            </button>
            <button onClick={() => setCode("")} style={btnStyle("#f9fafb", "#374151", !code)}>
              clear
            </button>
            <button
              onClick={handleSend}
              disabled={status !== "connected" || !code.trim()}
              style={btnStyle("#1d4ed8", "#fff", status !== "connected" || !code.trim())}
            >
              send →
            </button>
          </div>
        </header>

        {/* Body */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <LangBar active={lang} onChange={setLang} />
            <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Tab") {
                    e.preventDefault();
                    const el = e.currentTarget;
                    const s = el.selectionStart;
                    const updated = code.slice(0, s) + "  " + code.slice(el.selectionEnd);
                    setCode(updated);
                    requestAnimationFrame(() => {
                      el.selectionStart = el.selectionEnd = s + 2;
                    });
                  }
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                spellCheck={false}
                placeholder={`Paste or write ${lang} here…\n\nCtrl+Enter  →  send to all peers\nTab  →  indent`}
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "20px 24px",
                  fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', 'Menlo', monospace",
                  fontSize: 13,
                  lineHeight: 1.85,
                  resize: "none",
                  border: "none",
                  outline: "none",
                  background: "#fff",
                  color: "#111827",
                  caretColor: "#2563eb",
                  tabSize: 2,
                }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 16,
                  fontSize: 11,
                  color: "#d1d5db",
                  fontFamily: "monospace",
                  pointerEvents: "none",
                }}
              >
                {code.length.toLocaleString()} chars
              </span>
            </div>
          </div>

          <LogPanel
            entries={visibleLog}
            onClear={() => setClearedAt(log[0]?.id ?? 0)}
          />
        </div>

        {/* Footer */}
        <footer
          style={{
            padding: "5px 20px",
            borderTop: "0.5px solid #e5e7eb",
            background: "#fff",
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 11, color: "#9ca3af" }}>
            <kbd style={kbdStyle}>Ctrl</kbd>+<kbd style={kbdStyle}>Enter</kbd> send
          </span>
          <span style={{ fontSize: 11, color: "#9ca3af" }}>
            <kbd style={kbdStyle}>Tab</kbd> indent
          </span>
          <span style={{ fontSize: 11, color: "#d1d5db", marginLeft: "auto" }}>
            broadcast to all connected clients
          </span>
        </footer>
      </div>
    </>
  );
}