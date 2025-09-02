import React, { useState } from "react";
import Input from "../components/Input.jsx";
import { LS } from "../lib/storage.js";

const safeUUID = () => {
  try {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }
  } catch {}
  // RFC4122-ish fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export default function Auth({ onAuthed }) {
  // Safe parse helpers (avoid crashes if localStorage is empty/bad JSON)
  const safeParse = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const [users, setUsers] = useState(() => safeParse(LS.users, []));
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    role: "student",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState("");

  const handle = () => {
    setErr("");

    // basic validation
    if (!form.email || !form.password || (mode === "signup" && !form.name)) {
      setErr("Please fill all fields.");
      return;
    }

    if (mode === "signup") {
      if (users.some((u) => u.email === form.email)) {
        setErr("Email already registered.");
        return;
      }
      const user = { id: safeUUID(), ...form };
      const next = [...users, user];
      setUsers(next);
      localStorage.setItem(LS.users, JSON.stringify(next));
      localStorage.setItem(LS.session, JSON.stringify(user));
      // guard if onAuthed is missing
      if (typeof onAuthed === "function") onAuthed(user);
      return;
    }

    // login
    const user = users.find(
      (u) => u.email === form.email && u.password === form.password
    );
    if (!user) {
      setErr("Invalid credentials.");
      return;
    }
    localStorage.setItem(LS.session, JSON.stringify(user));
    if (typeof onAuthed === "function") onAuthed(user);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6 border">
        <h1 className="text-2xl font-bold mb-1">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          Sign in as Student or Tutor.
        </p>

        <div className="flex gap-2 mb-3">
          {["student", "tutor"].map((r) => (
            <button
              key={r}
              className={
                "px-3 py-1.5 rounded-full text-sm " +
                (form.role === r
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200")
              }
              onClick={() => setForm({ ...form, role: r })}
              type="button"
            >
              {r}
            </button>
          ))}
        </div>

        {mode === "signup" && (
          <Input
            label="Name"
            placeholder="Your name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />
        )}
        <Input
          label="Email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
        />

        {err ? <div className="text-red-600 text-sm mb-2">{err}</div> : null}

        <div className="flex items-center justify-between mt-3">
          <button
            onClick={handle}
            className="px-4 py-2 rounded-xl bg-black text-white"
            type="button"
          >
            {mode === "login" ? "Log in" : "Sign up"}
          </button>
          <button
            className="text-sm text-gray-600 hover:underline"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            type="button"
          >
            {mode === "login"
              ? "Need an account? Sign up"
              : "Have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}
