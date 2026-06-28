"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type ConnStatus = "connecting" | "connected" | "disconnected";

export interface LogEntry {
  id: number;
  ts: string;
  kind: "recv" | "send" | "sys" | "err";
  text: string;
}

let logId = 0;

export function useCodeShare(url: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<ConnStatus>("disconnected");
  const [code, setCode] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);

  const addLog = useCallback((kind: LogEntry["kind"], text: string) => {
    const ts = new Date().toLocaleTimeString("en", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLog((prev) => [{ id: logId++, ts, kind, text }, ...prev].slice(0, 80));
  }, []);

  const connect = useCallback(() => {
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.CONNECTING ||
        wsRef.current.readyState === WebSocket.OPEN)
    )
      return;

    setStatus("connecting");
    addLog("sys", `connecting to ${url}`);

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      addLog("sys", "connected");
    };

    ws.onmessage = (e) => {
      setCode(e.data);
      addLog("recv", `${e.data.length} chars received`);
    };

    ws.onclose = () => {
      setStatus("disconnected");
      addLog("err", "disconnected");
    };

    ws.onerror = () => {
      setStatus("disconnected");
      addLog("err", "connection failed — is the server running?");
    };
  }, [url, addLog]);

  const send = useCallback(
    (payload: string) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        addLog("err", "not connected");
        return false;
      }
      wsRef.current.send(payload);
      addLog("send", `${payload.length} chars sent`);
      return true;
    },
    [addLog]
  );

  const disconnect = useCallback(() => {
    wsRef.current?.close();
  }, []);

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [connect]);

  return { status, code, setCode, log, send, connect, disconnect };
}