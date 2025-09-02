import Header from "./Header.jsx";
import Input from "./Input.jsx";
import { LS } from "../lib/storage.js";
import React, { useState } from "react";

export default function Homework({ user }) {
  const [homeworks, setHomeworks] = React.useState(() =>
    JSON.parse(localStorage.getItem(LS.homeworks) || "[]")
  );
  const [file, setFile] = React.useState(null);
  const [title, setTitle] = React.useState("");
  const [notif, setNotif] = React.useState(() =>
    JSON.parse(localStorage.getItem(LS.notifications) || "[]")
  );

  const submit = () => {
    if (!file || !title) return alert("Please pick a file and title.");
    const reader = new FileReader();
    reader.onload = () => {
      const hw = {
        id: safeUUID(),
        owner: user.email,
        title,
        at: Date.now(),
        dataUrl: reader.result,
      };
      const next = [hw, ...homeworks];
      setHomeworks(next);
      localStorage.setItem(LS.homeworks, JSON.stringify(next));
      setTitle("");
      setFile(null);
      const n = {
        id: safeUUID(),
        at: Date.now(),
        text: `${user.name} submitted homework: ${hw.title}`,
      };
      const nn = [n, ...notif];
      setNotif(nn);
      localStorage.setItem(LS.notifications, JSON.stringify(nn));
      alert("Homework submitted & tutor notified (prototype)");
    };
    reader.readAsDataURL(file);
  };

  const mine = homeworks.filter((h) => h.owner === user.email);

  return (
    <section className="p-4 max-w-5xl grid md:grid-cols-5 gap-4">
      <div className="md:col-span-3 border rounded-2xl p-4 bg-white/80">
        <Header
          title="Submit Homework"
          subtitle="Upload work; tutors get notified automatically (demo)."
        />
        <Input label="Title" value={title} onChange={setTitle} />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          className="mt-2 px-4 py-2 rounded-xl bg-black text-white"
          onClick={submit}
        >
          Submit to Tutor
        </button>
        <div className="mt-4">
          <div className="font-semibold">My Submissions</div>
          <div className="grid gap-2 mt-2 max-h-64 overflow-auto">
            {mine.map((h) => (
              <div key={h.id} className="border rounded-xl p-2 bg-white">
                <div className="text-sm font-medium">{h.title}</div>
                <div className="text-xs text-gray-500">
                  {new Date(h.at).toLocaleString()}
                </div>
                <a
                  className="text-blue-600 underline text-sm"
                  href={h.dataUrl}
                  download={`${h.title}.file`}
                >
                  Download
                </a>
              </div>
            ))}
            {mine.length === 0 && (
              <div className="text-sm text-gray-500">No submissions yet.</div>
            )}
          </div>
        </div>
      </div>
      <div className="md:col-span-2 border rounded-2xl p-4 bg-white/80">
        <div className="font-semibold mb-2">
          Tutor Notifications (prototype)
        </div>
        <div className="grid gap-2 max-h-80 overflow-auto">
          {notif.map((n) => (
            <div key={n.id} className="border rounded-xl p-2 text-sm bg-white">
              {new Date(n.at).toLocaleTimeString()} • {n.text}
            </div>
          ))}
          {notif.length === 0 && (
            <div className="text-sm text-gray-500">No notifications yet.</div>
          )}
        </div>
      </div>
    </section>
  );
}
