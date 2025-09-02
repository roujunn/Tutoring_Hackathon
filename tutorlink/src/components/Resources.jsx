import Header from "./Header.jsx";
import { LS } from "../lib/storage.js";
import React, { useState } from "react";

function guessBadge(link) {
  try {
    const u = new URL(link);
    const ext = u.pathname.split(".").pop();
    if (["pdf", "pptx", "docx", "xlsx"].includes(ext)) return ext;
    if (u.hostname.includes("youtube") || u.hostname.includes("youtu"))
      return "video";
    return u.hostname.replace("www.", "");
  } catch {
    return "link";
  }
}

export default function Resources() {
  const [resources, setResources] = React.useState(
    () =>
      JSON.parse(localStorage.getItem(LS.resources) || "[]") || [
        {
          id: "r1",
          title: "Form 4 Probability Cheatsheet",
          link: "https://example.com/cheatsheet.pdf",
          votes: 12,
          badge: "pdf",
        },
      ]
  );
  const [title, setTitle] = React.useState("");
  const [link, setLink] = React.useState("");
  const [sort, setSort] = React.useState("top");

  const add = () => {
    if (!title || !link) return;
    const next = [
      {
        id: safeUUID(),
        title,
        link,
        votes: 0,
        badge: guessBadge(link),
      },
      ...resources,
    ];
    setResources(next);
    localStorage.setItem(LS.resources, JSON.stringify(next));
    setTitle("");
    setLink("");
  };
  const vote = (id, d) => {
    const next = resources
      .map((r) => (r.id === id ? { ...r, votes: Math.max(0, r.votes + d) } : r))
      .sort((a, b) => b.votes - a.votes);
    setResources(next);
    localStorage.setItem(LS.resources, JSON.stringify(next));
  };

  const list = [...resources].sort((a, b) =>
    sort === "top" ? b.votes - a.votes : a.title.localeCompare(b.title)
  );

  return (
    <section className="p-4 max-w-4xl">
      <Header
        title="Community Resources"
        subtitle="Share study materials; vote what’s most helpful."
      />
      <div className="grid md:grid-cols-3 gap-3 mb-3">
        <input
          className="border rounded-xl px-3 py-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border rounded-xl px-3 py-2"
          placeholder="https://..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <div className="self-end flex items-center gap-2">
          <button
            onClick={add}
            className="px-4 py-2 rounded-xl bg-black text-white"
          >
            Share
          </button>
          <select
            className="border rounded-xl px-3 py-2"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="top">Top</option>
            <option value="az">A–Z</option>
          </select>
        </div>
      </div>
      <div className="grid gap-2">
        {list.map((r) => (
          <div
            key={r.id}
            className="border rounded-2xl p-3 flex items-center justify-between bg-white/80"
          >
            <div className="min-w-0 pr-2">
              <div className="font-medium truncate">
                <a
                  className="underline"
                  href={r.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {r.title}
                </a>
              </div>
              <div className="text-xs text-gray-500 truncate">{r.link}</div>
              {r.badge && (
                <div className="mt-1">
                  <Chip tone="blue">{r.badge}</Chip>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => vote(r.id, 1)}
                className="px-2 py-1 border rounded-lg"
              >
                ▲
              </button>
              <div className="w-10 text-center font-semibold">{r.votes}</div>
              <button
                onClick={() => vote(r.id, -1)}
                className="px-2 py-1 border rounded-lg"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="text-sm text-gray-500">No resources yet.</div>
        )}
      </div>
    </section>
  );
}
