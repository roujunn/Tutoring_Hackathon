import React from "react";
import * as Icons from "lucide-react";
import Chip from "./Chip.jsx";

export default function Navbar({ current, setCurrent, user, onLogout }) {
  const t = (id, label, icon, roles) => ({ id, label, icon, roles });

  const allTabs = [
    t("tutors", user?.role === "tutor" ? "Students" : "Tutors", "Users", [
      "student",
      "tutor",
    ]),
    t("chat", "Chat", "MessageCircle", ["student", "tutor"]),
    t("notes", "Notes", "NotebookPen", ["student", "tutor"]),
    t("video", "Video", "Video", ["student"]),
    t("record", "Record", "Camera", ["student", "tutor"]),
    t("progress", "Progress", "ClipboardList", ["student"]),
    t("resources", "Resources", "Library", ["student", "tutor"]),
    t("subjects", "Requests", "GraduationCap", ["student", "tutor"]),
    t("profile", "Profile", "User", ["student", "tutor"]),
  ];

  const tabs = allTabs.filter((x) => x.roles.includes(user?.role || "student"));

  // ✅ Choose a logout icon safely and render as a component
  const LogoutIcon =
    Icons.LogOut ||
    Icons.LogOutIcon ||
    Icons.Power ||
    Icons.DoorOpen ||
    Icons.Circle;

  return (
    <aside className="h-full w-full md:w-64 border-r bg-white/70 backdrop-blur flex flex-col">
      <div className="p-4 border-b">
        <div className="text-lg font-bold">TutorLink</div>
        <div className="text-xs text-gray-600 mt-1">
          Prototype (localStorage)
        </div>
      </div>

      <nav className="p-2 grid gap-1">
        {tabs.map((item) => {
          const Icon = Icons[item.icon] || Icons.Circle;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrent(item.id)}
              type="button"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left ${
                active ? "bg-black text-white" : "hover:bg-gray-100"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto p-4 text-sm text-gray-700 flex items-center gap-2">
        <div className="truncate">{user?.name}</div>
        <Chip tone="blue">{user?.role}</Chip>
        <button
          onClick={onLogout}
          type="button"
          className="ml-auto inline-flex items-center gap-1 text-gray-600 hover:text-gray-900"
        >
          {LogoutIcon ? <LogoutIcon size={14} /> : null}
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
