import Header from "./Header.jsx";
import { LS } from "../lib/storage.js";
import React, { useState } from "react";

function aiSummarize(text) {
  const sents = text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
  const top = sents.slice(0, 3);
  return "• " + top.join("\n• ");
}

export default function Notes({ user }) {
  const [notes, setNotes] = React.useState(() =>
    JSON.parse(localStorage.getItem(LS.notes) || "[]")
  );
  const [text, setText] = React.useState("");

  const save = () => {
    if (!text.trim()) return;
    const n = {
      id:safeUUID(),
      owner: user.email,
      text,
      at: Date.now(),
      summary: aiSummarize(text),
    };
    const next = [n, ...notes];
    setNotes(next);
    localStorage.setItem(LS.notes, JSON.stringify(next));
    setText("");
  };

  const mine = notes.filter((n) => n.owner === user.email);

  return (
    <section className="p-4 max-w-4xl">
      <Header
        title="Progress Notes & AI Summary"
        subtitle="Store notes and generate quick summaries."
      />
      <textarea
        className="w-full border rounded-xl p-3 h-40 bg-white"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type lesson notes or paste transcript..."
      />
      <div className="flex gap-2 mt-2">
        <button
          className="px-4 py-2 rounded-xl bg-black text-white"
          onClick={save}
        >
          Save + AI Summary
        </button>
        <div className="text-xs text-gray-500 self-center">
          (Mock summarizer for prototype)
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        {mine.map((n) => (
          <div key={n.id} className="border rounded-2xl p-4 bg-white/80">
            <div className="text-xs text-gray-500">
              {new Date(n.at).toLocaleString()}
            </div>
            <div className="whitespace-pre-wrap mt-2">{n.text}</div>
            <div className="mt-3 p-3 bg-gray-50 rounded-xl">
              <div className="text-sm font-semibold mb-1">AI Summary</div>
              <div className="text-sm whitespace-pre-wrap">{n.summary}</div>
            </div>
          </div>
        ))}
        {mine.length === 0 && (
          <div className="text-sm text-gray-500">No notes yet.</div>
        )}
      </div>
    </section>
  );
}
