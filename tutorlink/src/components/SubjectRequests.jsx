import React, { useState } from "react";
import Header from "./Header.jsx";
import Input from "./Input.jsx";
import Chip from "./Chip.jsx";
import { LS } from "../lib/storage.js";

const safeUUID = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

export default function SubjectRequests({ user }) {
  const [reqs, setReqs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS.subjectRequests) || "[]");
    } catch {
      return [];
    }
  });
  const [subject, setSubject] = useState("");
  const [desc, setDesc] = useState("");
  const [err, setErr] = useState("");

  const persist = (next) => {
    setReqs(next);
    localStorage.setItem(LS.subjectRequests, JSON.stringify(next));
  };

  const add = () => {
    setErr("");
    if (!subject.trim()) {
      setErr("Please enter a subject/topic.");
      return;
    }
    const r = {
      id: safeUUID(),
      by: user.email,
      subject: subject.trim(),
      desc: desc.trim(),
      at: Date.now(),
      status: "open", // open | matched
      tutor: null, // when matched
    };
    persist([r, ...reqs]);
    setSubject("");
    setDesc("");
  };

  const pickUp = (id) => {
    // tutors pick an open request
    if (user.role !== "tutor") return;
    persist(
      reqs.map((r) =>
        r.id === id ? { ...r, status: "matched", tutor: user.email } : r
      )
    );
  };

  const closeMine = (id) => {
    // students mark their own as matched/closed
    if (user.role !== "student") return;
    persist(
      reqs.map((r) =>
        r.id === id && r.by === user.email ? { ...r, status: "matched" } : r
      )
    );
  };

  const mineFirst = [...reqs].sort(
    (a, b) => (a.by === user.email ? -1 : 0) - (b.by === user.email ? -1 : 0)
  );

  return (
    <section className="p-4 max-w-5xl">
      <Header
        title="Subject Requests"
        subtitle="Students post topics; tutors can pick them up."
      />
      {user.role === "student" && (
        <div className="grid md:grid-cols-3 gap-3 mb-3">
          <Input
            label="Subject"
            value={subject}
            onChange={setSubject}
            placeholder="e.g., Form 4 Probability"
          />
          <Input
            label="Description (optional)"
            value={desc}
            onChange={setDesc}
            placeholder="I need help with 9.3.1..."
          />
          <button
            onClick={add}
            type="button"
            className="self-end px-4 py-2 rounded-xl bg-black text-white"
          >
            Request
          </button>
          {err && (
            <div className="md:col-span-3 text-sm text-red-600">{err}</div>
          )}
        </div>
      )}

      <div className="grid gap-2">
        {mineFirst.map((r) => (
          <div key={r.id} className="border rounded-2xl p-3 bg-white/80">
            <div className="flex items-center justify-between gap-2">
              <div className="font-medium break-words">{r.subject}</div>
              <Chip tone={r.status === "open" ? "yellow" : "green"}>
                {r.status}
                {r.tutor && r.status === "matched" ? " • matched" : ""}
              </Chip>
            </div>
            {r.desc && (
              <div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                {r.desc}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              {new Date(r.at).toLocaleString()}
            </div>

            <div className="mt-2 flex gap-2 flex-wrap">
              {user.role === "tutor" && r.status === "open" && (
                <button
                  onClick={() => pickUp(r.id)}
                  type="button"
                  className="px-3 py-1 rounded-lg border"
                >
                  Pick up
                </button>
              )}
              {user.role === "student" &&
                r.by === user.email &&
                r.status === "open" && (
                  <button
                    onClick={() => closeMine(r.id)}
                    type="button"
                    className="px-3 py-1 rounded-lg border"
                  >
                    Mark as matched
                  </button>
                )}
              <div className="text-xs text-gray-500 ml-auto">
                by: {r.by}
                {r.tutor ? ` • tutor: ${r.tutor}` : ""}
              </div>
            </div>
          </div>
        ))}
        {reqs.length === 0 && (
          <div className="text-sm text-gray-500">No requests yet.</div>
        )}
      </div>
    </section>
  );
}
