import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "./Header.jsx";
import Whiteboard from "./Whiteboard.jsx";
import { LS } from "../lib/storage.js";

const safeUUID = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

function roomId(me, peer) {
  if (!peer) return "lobby";
  const a = (me?.email || "").toLowerCase();
  const b = (peer?.id || peer?.email || "").toLowerCase();
  return [a, b].sort().join("#");
}

export default function ChatMeeting({ user, peer }) {
  const [all, setAll] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS.messages) || "[]");
    } catch {
      return [];
    }
  });
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const room = useMemo(() => roomId(user, peer), [user, peer]);
  const messages = useMemo(
    () => all.filter((m) => m.room === room),
    [all, room]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const persist = (next) => {
    setAll(next);
    localStorage.setItem(LS.messages, JSON.stringify(next));
  };

  const send = () => {
    const body = text.trim();
    if (!body) return;
    const msg = {
      id: safeUUID(),
      room,
      fromEmail: user.email,
      fromName: user.name,
      text: body,
      at: Date.now(),
    };
    persist([...all, msg]);
    setText("");
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <section className="p-4 grid md:grid-cols-5 gap-4">
      <div className="md:col-span-3 border rounded-2xl p-4 bg-white/80">
        <Header
          title={`Chat with ${
            peer?.name || (room === "lobby" ? "Lobby" : "Peer")
          }`}
          subtitle={`Room: ${room}`}
        />
        <div className="h-72 overflow-y-auto border rounded-xl p-3 bg-gray-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`mb-2 ${
                m.fromEmail === user.email ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`${
                  m.fromEmail === user.email
                    ? "bg-black text-white"
                    : "bg-white border"
                } inline-block px-3 py-1.5 rounded-xl`}
              >
                <span className="opacity-70 mr-1 text-xs">{m.fromName}:</span>{" "}
                {m.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="mt-2 flex gap-2">
          <textarea
            className="flex-1 border rounded-xl px-3 py-2 h-16 resize-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKey}
            placeholder={
              peer
                ? "Type a message…"
                : "No partner selected — go pick a tutor/student"
            }
          />
          <button
            onClick={send}
            type="button"
            className="px-4 py-2 rounded-xl bg-black text-white self-start"
          >
            Send
          </button>
        </div>
      </div>
      <div className="md:col-span-2 border rounded-2xl p-4 bg-white/80">
        <div className="font-semibold mb-2">Whiteboard</div>
        <Whiteboard />
      </div>
    </section>
  );
}
