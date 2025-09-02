import React, { useMemo, useState } from "react";
import Header from "./Header.jsx";
import Chip from "./Chip.jsx";
import { LS } from "../lib/storage.js";

const fakeTutors = [
  {
    id: "t1",
    name: "Aisyah Z.",
    subjects: ["Math (F4)", "Statistics"],
    rating: 4.9,
    price: 45,
    online: true,
    tags: ["SPM", "Weekend"],
  },
  {
    id: "t2",
    name: "Kenji M.",
    subjects: ["Physics", "Chemistry"],
    rating: 4.7,
    price: 50,
    online: false,
    tags: ["A-Level"],
  },
  {
    id: "t3",
    name: "Priya R.",
    subjects: ["English", "Essay Writing"],
    rating: 4.8,
    price: 40,
    online: true,
    tags: ["IELTS", "Writing"],
  },
];

export default function Tutors({ user, onConnect }) {
  const [q, setQ] = useState("");

  if (user?.role === "tutor") {
    // Show available students (from open subject requests)
    const reqs = useMemo(() => {
      try {
        return JSON.parse(localStorage.getItem(LS.subjectRequests) || "[]");
      } catch {
        return [];
      }
    }, []);
    // group by student email, only open
    const grouped = Object.values(
      reqs
        .filter((r) => r.status === "open")
        .reduce((acc, r) => {
          acc[r.by] = acc[r.by] || {
            email: r.by,
            count: 0,
            latest: r,
            subjects: new Set(),
          };
          acc[r.by].count += 1;
          acc[r.by].subjects.add(r.subject);
          if (!acc[r.by].latest || r.at > acc[r.by].latest.at)
            acc[r.by].latest = r;
          return acc;
        }, {})
    );
    // enrich with name from users list
    const users = useMemo(() => {
      try {
        return JSON.parse(localStorage.getItem(LS.users) || "[]");
      } catch {
        return [];
      }
    }, []);
    const students = grouped
      .map((g) => {
        const u = users.find((x) => x.email === g.email);
        return {
          id: g.email,
          name: u?.name || g.email.split("@")[0],
          email: g.email,
          subjects: Array.from(g.subjects),
          openCount: g.count,
          latest: g.latest,
        };
      })
      .filter((s) =>
        [s.name, s.email, ...s.subjects]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase())
      );

    return (
      <section className="p-4">
        <Header
          title="Available Students"
          subtitle="Students with open requests you can pick up."
        />
        <div className="flex items-end justify-between gap-3 mb-4">
          <input
            className="border rounded-xl px-3 py-2 w-full md:w-80"
            placeholder="Search name/email/subject"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {students.map((s) => (
            <div
              key={s.id}
              className="border rounded-2xl p-4 shadow-sm bg-white/80 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-semibold">{s.name}</div>
                <Chip tone="yellow">{s.openCount} open</Chip>
              </div>
              <div className="text-sm text-gray-700 break-words">
                {s.subjects.join(" • ")}
              </div>
              {s.latest && (
                <div className="text-xs text-gray-500 mt-1">
                  Latest: “{s.latest.subject}” •{" "}
                  {new Date(s.latest.at).toLocaleString()}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  onClick={() =>
                    onConnect({ id: s.email, email: s.email, name: s.name })
                  }
                  className="w-full bg-black text-white rounded-xl py-2"
                >
                  Message
                </button>
                <button className="w-full border rounded-xl py-2">
                  View Requests
                </button>
              </div>
            </div>
          ))}
          {students.length === 0 && (
            <div className="text-sm text-gray-500">
              No open student requests yet.
            </div>
          )}
        </div>
      </section>
    );
  }

  // Student view: show tutors
  const filtered = fakeTutors.filter((t) =>
    [t.name, ...t.subjects, ...(t.tags || [])]
      .join(" ")
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  return (
    <section className="p-4">
      <Header
        title="Available Tutors"
        subtitle="Browse tutors and connect to chat/meeting."
      />
      <div className="flex items-end justify-between gap-3 mb-4">
        <input
          className="border rounded-xl px-3 py-2 w-full md:w-80"
          placeholder="Search name, subject, tag"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="border rounded-2xl p-4 shadow-sm bg-white/80 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold">{t.name}</div>
              <Chip tone={t.online ? "green" : "gray"}>
                {t.online ? "Online" : "Offline"}
              </Chip>
            </div>
            <div className="text-sm text-gray-700">
              {t.subjects.join(" • ")}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              ⭐ {t.rating} • RM{t.price}/hr
            </div>
            <div className="mt-2 flex gap-1 flex-wrap">
              {(t.tags || []).map((tag) => (
                <Chip key={tag} tone="violet">
                  {tag}
                </Chip>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                onClick={() =>
                  onConnect({
                    id: t.id,
                    email: t.id + "@example.com",
                    name: t.name,
                  })
                }
                className="w-full bg-black text-white rounded-xl py-2"
              >
                Connect
              </button>
              <button className="w-full border rounded-xl py-2">Profile</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
