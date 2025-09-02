import React, { useState } from "react";
import Header from "./Header.jsx";
import Input from "./Input.jsx";
import { LS } from "../lib/storage.js";

export default function Profile({ user, onUpdate }) {
  const [name, setName] = useState(user?.name || "");
  const [role, setRole] = useState(user?.role || "student");
  const email = user?.email || "";

  const save = () => {
    try {
      const users = JSON.parse(localStorage.getItem(LS.users) || "[]");
      const nextUsers = users.map((u) =>
        u.email === email ? { ...u, name, role } : u
      );
      localStorage.setItem(LS.users, JSON.stringify(nextUsers));
      const nextSession = { ...user, name, role };
      localStorage.setItem(LS.session, JSON.stringify(nextSession));
      onUpdate?.(nextSession);
      alert("Profile saved.");
    } catch (e) {
      alert("Failed to save profile: " + (e?.message || e));
    }
  };

  return (
    <section className="p-4 max-w-xl">
      <Header title="My Profile" subtitle="Manage your account details." />
      <div className="border rounded-2xl p-4 bg-white">
        <div className="text-sm text-gray-500 mb-2">Email (read-only)</div>
        <div className="px-3 py-2 border rounded-xl bg-gray-50 text-gray-700 break-words">
          {email}
        </div>
        <div className="mt-3">
          <Input label="Name" value={name} onChange={setName} />
        </div>
        <label className="block mb-3">
          <div className="text-sm text-gray-600 mb-1">Role</div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 bg-white"
          >
            <option value="student">Student</option>
            <option value="tutor">Tutor</option>
          </select>
        </label>
        <button
          onClick={save}
          type="button"
          className="px-4 py-2 rounded-xl bg-black text-white"
        >
          Save
        </button>
      </div>
    </section>
  );
}
